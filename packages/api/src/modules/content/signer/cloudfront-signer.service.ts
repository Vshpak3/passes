import { getSignedCookies, getSignedUrl } from '@aws-sdk/cloudfront-signer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CookieOptions, Response } from 'express'

@Injectable()
export class CloudFrontSignerService {
  private env: string
  private keyPairId: string
  private privateKey: string
  private cloudfrontUrl: string
  private cookieOptions: CookieOptions
  private readonly signedUrlExpirationTime = 1000 * 60 * 5 // 5 minutes expiration time in ms
  private readonly signedCookieExpirationTime = 1000 * 60 * 60 * 24 // 1 day expiration time in ms

  constructor(private readonly configService: ConfigService) {
    this.env = configService.get('infra.env') as string
    this.keyPairId = configService.get('cloudfront.keyPairId') as string
    this.privateKey = configService.get('cloudfront.privateKey') as string
    this.cloudfrontUrl = configService.get('cloudfront.baseUrl') as string
    this.cookieOptions = configService.get(
      'cloudfront.cookieOptions',
    ) as CookieOptions
  }

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

  async signCookies(userId: string, res: Response) {
    if (this.env === 'dev') return

    const expirationTime = new Date(
      Date.now() + this.signedCookieExpirationTime,
    ).getTime()

    const policy = JSON.stringify({
      Statement: [
        {
          Resource: `${this.cloudfrontUrl}/${userId}*`,
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
}
