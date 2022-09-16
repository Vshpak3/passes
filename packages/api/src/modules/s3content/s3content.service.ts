import {
  HeadObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedCookies, getSignedUrl } from '@aws-sdk/cloudfront-signer'
import { getSignedUrl as getPresignedUrl } from '@aws-sdk/s3-request-presigner'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CookieOptions, Response } from 'express'

import { getAwsConfig } from '../../util/aws.util'

const FOLDER_BUCKET_MAP = {
  profile: 'public',
  pass: 'public',
  nft: 'nft',
  upload: 'usercontent',
  media: 'usercontent',
} as const
type S3Bucket = typeof FOLDER_BUCKET_MAP[keyof typeof FOLDER_BUCKET_MAP]

@Injectable()
export class S3ContentService {
  private s3Client: S3Client
  private s3Buckets: { [K in S3Bucket]: string }
  private env: string
  private keyPairId: string
  private privateKey: string
  private cloudfrontUrl: string
  private cookieOptions: CookieOptions
  private readonly signedUrlExpirationTime: number
  private readonly signedCookieExpirationTime: number

  constructor(private readonly configService: ConfigService) {
    this.env = configService.get('infra.env') as string
    this.keyPairId = configService.get('cloudfront.keyPairId') as string
    this.privateKey = configService.get('cloudfront.privateKey') as string
    this.cloudfrontUrl = configService.get('cloudfront.baseUrl') as string
    this.cookieOptions = configService.get(
      'cloudfront.cookieOptions',
    ) as CookieOptions
    this.signedUrlExpirationTime = configService.get(
      'cloudfront.signedUrlExpirationTime',
    ) as number
    this.signedCookieExpirationTime = configService.get(
      'cloudfront.signedCookieExpirationTime',
    ) as number
    this.s3Buckets = configService.get('s3_bucket') as {
      [K in S3Bucket]: string
    }
    this.s3Client = new S3Client(getAwsConfig(configService))
  }

  private getFolderFromPath(path: string) {
    const folderPathRegexp = new RegExp(
      `^(${Object.keys(FOLDER_BUCKET_MAP).join('|')})`,
    )
    const { 1: _folder } = path.match(folderPathRegexp) || []
    const folder = _folder as keyof typeof FOLDER_BUCKET_MAP

    if (!folder) throw new BadRequestException('invalid path')

    return folder
  }

  /**
   * Generate the S3 key where the file will be uploaded to
   * @param folder upstream directory (profile | pass | nft | upload)
   * @param rest rest of the path
   * @returns upload path
   */
  private generateS3Key = (
    folder: keyof typeof FOLDER_BUCKET_MAP,
    rest: string,
  ) => {
    // upload files directly to the downstream directory in dev
    if (this.env === 'dev')
      switch (folder) {
        case 'upload':
          return `media/${rest}`
        case 'profile':
          return `profile/${rest
            .replace('upload/', '')
            .replace('profile', 'profile-image')}`
        default:
          return `${folder}/${rest.replace('upload/', '')}`
      }
    return `${folder}/${rest}`
  }

  /**
   * Sets CloudFront signed cookies to give full access to a path, supports wildcards
   * @param res response object
   * @param path path to give access to
   */
  async signCookies(res: Response, path = '') {
    if (this.env === 'dev') return

    const expirationTime = new Date(
      Date.now() + this.signedCookieExpirationTime,
    ).getTime()

    const policy = JSON.stringify({
      Statement: [
        {
          Resource: `${this.cloudfrontUrl}/${path}*`,
          Condition: {
            DateLessThan: {
              'AWS:EpochTime': expirationTime,
            },
          },
        },
      ],
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // ignore ts error - url property is missing (it is not required when using policies)
    const cookies = getSignedCookies({
      policy,
      keyPairId: this.keyPairId,
      privateKey: this.privateKey,
    })

    Object.entries(cookies).forEach(([key, value]) =>
      res.cookie(key, value, this.cookieOptions),
    )
  }

  /**
   * Returns CloudFront signed url to give full access to a specific path, wildcards not supported
   * @param path
   * @returns
   */
  async signUrl(path: string) {
    const url = this.cloudfrontUrl + '/' + path

    if (this.env === 'dev')
      return {
        url,
      }

    const expirationTime = new Date(
      Date.now() + this.signedUrlExpirationTime,
    ).toISOString()

    const signedUrl: string = getSignedUrl({
      url,
      dateLessThan: expirationTime,
      keyPairId: this.keyPairId,
      privateKey: this.privateKey,
    })

    return {
      url: signedUrl,
    }
  }

  /**
   * Returns S3 presigned url used to put object in bucket.
   *
   * Replaces bucket domain with CloudFront so requests go through the cdn first
   * @param path path where file will be uploaded to. Starts with one of the upstream directories (profile | pass | nft | upload)
   * @returns signed url used to upload files to
   */
  async preSignUrl(path: string) {
    const folder = this.getFolderFromPath(path)
    const rest = path.split(folder + '/')[1]
    const Bucket = this.s3Buckets[FOLDER_BUCKET_MAP[folder]]
    const Key = this.generateS3Key(folder, rest)
    const command = new PutObjectCommand({ Bucket, Key })

    let url = await getPresignedUrl(this.s3Client, command, {
      expiresIn: this.signedUrlExpirationTime / 1000, // convert to seconds
    })
    // Replaces bucket domain with CloudFront
    url = this.cloudfrontUrl + '/' + Key + url.split(Key)?.[1]
    return url
  }

  /**
   * Check if object exists at a specific path
   * @param path object path
   * @returns true if object exists. false if status code is 404
   */
  async doesObjectExist(path: string) {
    const folder = this.getFolderFromPath(path)
    const Bucket = this.s3Buckets[FOLDER_BUCKET_MAP[folder]]
    try {
      await this.s3Client.send(new HeadObjectCommand({ Bucket, Key: path }))
      return true
    } catch (error) {
      if (error?.$metadata?.httpStatusCode === 404) return false
      throw error
    }
  }

  /**
   * S3Client PutObject function. Adds an object to a bucket
   * @param input.Bucket bucket name
   * @param input.Body object data
   * @param input.Key object key
   */
  putObject(input: PutObjectCommandInput) {
    return this.s3Client.send(new PutObjectCommand(input))
  }
}
