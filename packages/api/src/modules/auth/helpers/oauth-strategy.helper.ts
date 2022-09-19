import { UnauthorizedException } from '@nestjs/common'
import { Profile } from 'passport-google-oauth20'

import { AuthRecord } from '../core/auth-record'
import { OAuthProvider } from './oauth-provider.type'

export async function validateUser(
  profile: Profile,
  oauthProvider: OAuthProvider,
  emailRequired = false,
): Promise<AuthRecord> {
  try {
    const { id, emails } = profile

    let email: string | null = null
    if (emails !== undefined) {
      email = emails[0].value
    }

    if (!email && emailRequired) {
      this.logger.error('Failed to get email from profile')
      this.metrics.increment(`login.failure.${oauthProvider}`)
      throw new UnauthorizedException()
    }

    const authRecord = await this.authService.findOrCreateOAuthRecord(
      oauthProvider,
      id,
      email,
    )
    this.metrics.increment(`login.success.${oauthProvider}`)
    return authRecord
  } catch (err) {
    this.logger.error('Error occurred while validating:', err)
    this.metrics.increment(`login.failure.${oauthProvider}`)
    throw new UnauthorizedException()
  }
}
