import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Profile, Strategy } from 'passport-facebook'
import { Logger } from 'winston'

import { UserService } from '../../user/user.service'

@Injectable()
export class FacebookOauthStrategy extends PassportStrategy(
  Strategy,
  'facebook',
) {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly usersService: UserService,
  ) {
    super({
      clientID: configService.get('oauth.facebook.id'),
      clientSecret: configService.get('oauth.facebook.secret'),
      callbackURL: configService.get('oauth.facebook.redirect_url'),
      scope: ['email'],
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    try {
      const { id, emails } = profile
      const email = emails && emails.length ? emails[0].value : ''

      let user = await this.usersService.findOneByOAuth(id, 'facebook')
      if (!user) {
        user = await this.usersService.createOAuthUser(email, 'facebook', id)
      }

      return user
    } catch (err) {
      this.logger.error('Error occurred while validating:', err)
      return null
    }
  }
}
