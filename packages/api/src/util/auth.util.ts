import * as querystring from 'node:querystring'

import { Response } from 'express'

import { AuthRecord } from '../modules/auth/core/auth-record'
import {
  AccessTokensResponseDto,
  CloudfrontSignedCookiesOutput,
} from '../modules/auth/dto/access-tokens.dto'
import { JwtService } from '../modules/auth/jwt/jwt.service'
import { S3ContentService } from '../modules/s3content/s3content.service'

export async function createTokens(
  res: Response,
  authRecord: AuthRecord,
  jwtService: JwtService,
  s3contentService: S3ContentService,
): Promise<AccessTokensResponseDto> {
  const accessToken = jwtService.createAccessToken(authRecord)
  let refreshToken: string | undefined = undefined
  if (authRecord.isVerified) {
    refreshToken = jwtService.createRefreshToken(authRecord)
  }

  let signedCookies: CloudfrontSignedCookiesOutput | undefined = undefined
  if (authRecord.isCreator) {
    signedCookies = await s3contentService.signCookies(
      res,
      `*/${authRecord.id}`,
    )
  }
  return new AccessTokensResponseDto(accessToken, refreshToken, signedCookies)
}

/**
 * Handles redirect after successful OAuth login.
 *
 * Note: the type of the user is AuthRecordDto. This is the type returned from
 * the *OauthStrategy.validate methods and is what is set for Request.user.
 */
export async function redirectAfterOAuthLogin(
  res: Response,
  authRecord: AuthRecord,
) {
  const tokens = await createTokens(
    res,
    authRecord,
    this.jwtService,
    this.s3contentService,
  )

  const url = this.configService.get('clientUrl')
  return res.redirect(
    `${url}/auth/success?${querystring.stringify({
      ...{ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken },
    })}`,
  )
}
