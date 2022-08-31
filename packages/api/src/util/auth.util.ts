import { Response } from 'express'

import { UserEntity } from '../modules/user/entities/user.entity'

export async function redirectAfterSuccessfulLogin(
  res: Response,
  user: UserEntity,
) {
  const accessToken = this.jwtAuthService.createAccessToken(user)
  const refreshToken = this.jwtRefreshService.createRefreshToken(user.id)
  // TODO: only generate signed cookies for creators
  await this.s3Service.signCookies(res, `*/${user.id}`)
  return res.redirect(
    this.configService.get('clientUrl') +
      '/auth/success?accessToken=' +
      accessToken +
      '&refreshToken=' +
      refreshToken,
  )
}
