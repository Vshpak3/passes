import { Response } from 'express'

import { JwtAuthService } from '../modules/auth/jwt/jwt-auth.service'
import { JwtRefreshService } from '../modules/auth/jwt/jwt-refresh.service'
import { S3ContentService } from '../modules/s3content/s3content.service'
import { UserEntity } from '../modules/user/entities/user.entity'

export async function createTokens(
  res: Response,
  user: UserEntity,
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

export async function redirectAfterSuccessfulLogin(
  res: Response,
  user: UserEntity,
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
