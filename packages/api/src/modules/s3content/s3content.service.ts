import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedCookies, getSignedUrl } from '@aws-sdk/cloudfront-signer'
import { getSignedUrl as getPresignedUrl } from '@aws-sdk/s3-request-presigner'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CookieOptions, Response } from 'express'
import { v4 } from 'uuid'

import { getAwsConfig } from '../../util/aws.util'

const FOLDER_BUCKET_MAP = {
  profile: 'public',
  nft: 'nft',
  uploads: 'usercontent',
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

  /**
   * Generate the file name of the file to be uploaded
   * @param folder
   * @param userId
   * @param extension
   * @returns
   */
  private generateFileName = (
    folder: string,
    userId: string,
    extension: string,
  ) =>
    `${
      // upload files directly to the downstream directory in dev
      this.env === 'dev' && folder === 'uploads' ? 'media' : folder
    }/${userId}/${v4()}.${extension}`

  /**
   * Sets CloudFront signed cookies to give full access to a path, supports wildcards
   * @param res
   * @param path
   * @returns
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
    const expirationTime = new Date(
      Date.now() + this.signedUrlExpirationTime,
    ).toISOString()

    const url = this.cloudfrontUrl + '/' + path

    if (this.env === 'dev')
      return {
        url,
      }

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
   * Renames files to a generated file name
   *
   * Replaces bucket domain with CloudFront so requests go through the cdn first
   * @param path
   * @param userId
   * @returns
   */
  async preSignUrl(path: string, userId: string) {
    const folderPathRegexp = new RegExp(
      `^(${Object.keys(FOLDER_BUCKET_MAP).join('|')})\\/(.*)\\.(\\w+)$`,
    )
    const {
      1: folder,
      2: fileName,
      3: extension,
    } = path.match(folderPathRegexp) || []

    if (!folder || !fileName || !extension)
      throw new BadRequestException('invalid path')

    const Bucket = this.s3Buckets[FOLDER_BUCKET_MAP[folder]]

    const Key = this.generateFileName(folder, userId, extension)
    const command = new PutObjectCommand({ Bucket, Key })

    let url = await getPresignedUrl(this.s3Client, command, {
      expiresIn: this.signedUrlExpirationTime / 1000, // convert to seconds
    })
    // Replaces bucket domain with CloudFront
    url = this.cloudfrontUrl + '/' + Key + url.split(Key)?.[1]
    return url
  }

  /**
   * S3Client PutObject function
   * @param input
   * @returns
   */
  putObject(input: PutObjectCommandInput) {
    return this.s3Client.send(new PutObjectCommand(input))
  }
}
