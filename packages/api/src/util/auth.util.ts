import { Response } from 'express'

import { JwtAuthService } from '../modules/auth/jwt/jwt-auth.service'
import { JwtRefreshService } from '../modules/auth/jwt/jwt-refresh.service'
import { S3ContentService } from '../modules/s3content/s3content.service'
import { UserDto } from '../modules/user/dto/user.dto'

export async function createTokens(
  res: Response,
  user: UserDto,
  jwtAuthService: JwtAuthService,
  jwtRefreshService: JwtRefreshService,
  s3contentService: S3ContentService,
) {
  const accessToken = jwtAuthService.createAccessToken(user)
  const refreshToken = jwtRefreshService.createRefreshToken(user.id)
  if (user.isCreator) {
    await s3contentService.signCookies(res, `*/${user.id}`)
  }
  return { accessToken, refreshToken }
}

/**
 * Handles redirect after successful OAuth login.
 *
 * Note: the type of the user is UserDto. This is the type returned from the
 * *OauthStrategy.validate methods and is what is set for Request.user.
 */
export async function redirectAfterSuccessfulLogin(
  res: Response,
  user: UserDto,
) {
  const tokens = await createTokens(
    res,
    user,
    this.jwtAuthService,
    this.jwtRefreshService,
    this.s3contentService,
  )
  return res.redirect(
    this.configService.get('clientUrl') +
      '/auth/success?accessToken=' +
      tokens.accessToken +
      '&refreshToken=' +
      tokens.refreshToken,
  )
}
