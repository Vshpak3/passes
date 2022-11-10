import {
  CopyObjectCommand,
  CopyObjectCommandInput,
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3'
import {
  CloudfrontSignedCookiesOutput,
  getSignedCookies,
  getSignedUrl,
} from '@aws-sdk/cloudfront-signer'
import { getSignedUrl as getPresignedUrl } from '@aws-sdk/s3-request-presigner'
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CookieOptions, Response } from 'express'
import path, { sep } from 'path'

import { getAwsConfig } from '../../util/aws.util'
import { isEnv } from '../../util/env'

const FOLDER_BUCKET_MAP = {
  profile: 'public',
  pass: 'public',
  nft: 'nft',
  upload: 'usercontent',
  media: 'usercontent',
  w9: 'w9',
} as const

type Folders = keyof typeof FOLDER_BUCKET_MAP

type S3Bucket = { [K in typeof FOLDER_BUCKET_MAP[Folders]]: string }

@Injectable()
export class S3ContentService {
  private readonly s3Client: S3Client
  private readonly s3Buckets: S3Bucket

  private readonly keyPairId: string
  private readonly privateKey: string
  private readonly cloudfrontUrl: string
  private readonly cookieOptions: CookieOptions
  private readonly signedUrlExpirationTime: number
  private readonly signedCookieExpirationTime: number

  constructor(private readonly configService: ConfigService) {
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

    this.s3Buckets = configService.get('s3_bucket') as S3Bucket
    this.s3Client = new S3Client(getAwsConfig(configService))
  }

  private cloudFrontPath = (...args: string[]) => {
    return `${this.cloudfrontUrl}/${path.join(...args)}`
  }

  private getBucketKeyFromPath(path: string): [string, string] {
    const folder = path.split(sep)[0]

    const bucket = this.s3Buckets[FOLDER_BUCKET_MAP[folder]]
    if (!bucket) {
      throw new BadRequestException('Invalid path')
    }

    return [bucket, path]
  }

  /**
   * Sets CloudFront signed cookies to give full access to a path, supports wildcards
   * @param res response object
   * @param path path to give access to
   */
  async signCookies(
    res: Response,
    path = '',
  ): Promise<CloudfrontSignedCookiesOutput | undefined> {
    if (isEnv('dev')) {
      return
    }

    const expirationTime = new Date(
      Date.now() + this.signedCookieExpirationTime,
    ).getTime()

    const policy = JSON.stringify({
      Statement: [
        {
          Resource: this.cloudFrontPath(`${path}*`),
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
    return cookies
  }

  /**
   * Returns CloudFront signed url to give full access to a specific path, wildcards not supported
   * @param path
   * @returns
   */
  signUrlForContentViewing(path: string): string {
    const url = this.cloudFrontPath(path)

    if (isEnv('dev')) {
      return url
    }

    const expirationTime = new Date(
      Date.now() + this.signedUrlExpirationTime,
    ).toISOString()

    return getSignedUrl({
      url,
      dateLessThan: expirationTime,
      keyPairId: this.keyPairId,
      privateKey: this.privateKey,
    })
  }

  /**
   * Returns S3 presigned url used to put object in bucket.
   *
   * Replaces bucket domain with CloudFront so requests go through the cdn first
   * @param _path path where file will be uploaded to. Starts with one of the upstream directories
   * @returns signed url used to upload files to
   */
  async signUrlForContentUpload(_path: string): Promise<string> {
    const [Bucket, Key] = this.getBucketKeyFromPath(_path)

    // Upload files directly to the downstream directory in dev
    if (isEnv('dev')) {
      return this.cloudFrontPath(Key.replace('upload/', 'media/'))
    }

    const url = await getPresignedUrl(
      this.s3Client,
      new PutObjectCommand({ Bucket, Key }),
      {
        expiresIn: this.signedUrlExpirationTime / 1000, // convert to seconds
      },
    )

    // Replaces bucket domain with CloudFront
    return this.cloudFrontPath(Key + url.split(Key)?.[1])
  }

  /**
   * Check if object exists at a specific path
   * @param _path object path
   * @returns true if object exists. false if status code is 404
   */
  async doesObjectExist(_path: string): Promise<boolean> {
    const [Bucket, Key] = this.getBucketKeyFromPath(_path)
    try {
      await this.s3Client.send(new HeadObjectCommand({ Bucket, Key }))
      return true
    } catch (error) {
      if (error?.$metadata?.httpStatusCode === HttpStatus.NOT_FOUND) {
        return false
      }
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

  /**
   * S3Client DeleteObject function. Deletes an object from a bucket
   * @param path Path of the object to delete
   */
  deleteObject(path: string) {
    const [Bucket, Key] = this.getBucketKeyFromPath(path)
    return this.s3Client.send(new DeleteObjectCommand({ Bucket, Key }))
  }

  /**
   * S3Client CopyObject function. Copys an object to a bucket
   * @param input.Bucket bucket name
   * @param input.Body object data
   * @param input.Key object key
   */
  copyObject(input: CopyObjectCommandInput) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return this.s3Client.send(new CopyObjectCommand(input), (err, _data) => {
      if (err) {
        throw new InternalServerErrorException('failed to copy file')
      }
    })
  }
}
