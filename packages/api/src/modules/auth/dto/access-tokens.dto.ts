import { DtoProperty } from '../../../web/dto.web'

export class CloudfrontSignedCookiesOutput {
  /** ID of the Cloudfront key pair. */
  'CloudFront-Key-Pair-Id': string
  /** Hashed, signed, and base64-encoded version of the JSON policy. */
  'CloudFront-Signature': string
  /** The unix date time for when the signed URL or cookie can no longer be accessed. */
  'CloudFront-Expires'?: number
  /** Base64-encoded version of the JSON policy. */
  'CloudFront-Policy'?: string
}

export class AccessTokensResponseDto {
  @DtoProperty({ type: 'string' })
  accessToken: string

  @DtoProperty({ type: 'string' })
  refreshToken?: string

  @DtoProperty({ type: 'any', optional: true })
  signedCookies?: CloudfrontSignedCookiesOutput

  constructor(
    accessToken: string,
    refreshToken?: string,
    signedCookies?: CloudfrontSignedCookiesOutput,
  ) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    this.signedCookies = signedCookies
  }
}
