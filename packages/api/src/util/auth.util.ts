import { Response } from 'express'
import * as querystring from 'node:querystring'

import { AccessTokensResponseDto } from '../modules/auth/dto/access-tokens-dto'
import { AuthRecordDto } from '../modules/auth/dto/auth-record-dto'
import { JwtAuthService } from '../modules/auth/jwt/jwt-auth.service'
import { JwtRefreshService } from '../modules/auth/jwt/jwt-refresh.service'
import { S3ContentService } from '../modules/s3content/s3content.service'

export async function createTokens(
  res: Response,
  authRecord: AuthRecordDto,
  jwtAuthService: JwtAuthService,
  jwtRefreshService: JwtRefreshService,
  s3contentService: S3ContentService,
): Promise<AccessTokensResponseDto> {
  const accessToken = jwtAuthService.createAccessToken(authRecord)
  let refreshToken: string | undefined = undefined
  if (jwtAuthService.isVerified(authRecord)) {
    refreshToken = jwtRefreshService.createRefreshToken(authRecord)
  }
  if (authRecord.isCreator) {
    await s3contentService.signCookies(res, `*/${authRecord.id}`)
  }
  return new AccessTokensResponseDto(accessToken, refreshToken)
}

/**
 * Handles redirect after successful OAuth login.
 *
 * Note: the type of the user is AuthRecordDto. This is the type returned from
 * the *OauthStrategy.validate methods and is what is set for Request.user.
 */
export async function redirectAfterOAuthLogin(
  res: Response,
  authRecord: AuthRecordDto,
) {
  const tokens = await createTokens(
    res,
    authRecord,
    this.jwtAuthService,
    this.jwtRefreshService,
    this.s3contentService,
  )

  const url = this.configService.get('clientUrl')
  return res.redirect(
    `${url}/auth/success?${querystring.stringify({ ...tokens })}`,
  )
}
