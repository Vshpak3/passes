import { UnauthorizedException } from '@nestjs/common'
import { Profile } from 'passport-google-oauth20'

import { UserDto } from '../../user/dto/user.dto'
import { OAuthProvider } from './oauth-provider.type'

export async function validateUser(
  profile: Profile,
  oauthProvider: OAuthProvider,
  emailRequired = false,
): Promise<UserDto> {
  try {
    const { id, emails } = profile

    let email = ''
    if (emails !== undefined) {
      email = emails[0].value
    }

    if (!email && emailRequired) {
      this.logger.error('Failed to get email from profile')
      this.metrics.increment(`login.failure.${oauthProvider}`)
      throw new UnauthorizedException()
    }

    let user = await this.usersService.findOneByOAuth(id, oauthProvider)
    if (!user) {
      user = await this.usersService.createOAuthUser(email, oauthProvider, id)
    }

    this.metrics.increment(`login.success.${oauthProvider}`)
    return user
  } catch (err) {
    this.logger.error('Error occurred while validating:', err)
    this.metrics.increment(`login.failure.${oauthProvider}`)
    throw new UnauthorizedException()
  }
}
