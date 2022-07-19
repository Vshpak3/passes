import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-google-oauth20'

import { UserService } from '../../user/user.service'

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UserService,
  ) {
    super({
      clientID: configService.get('oauth.google.id'),
      clientSecret: configService.get('oauth.google.secret'),
      callbackURL: configService.get('oauth.google.redirect_url'),
      scope: ['email', 'profile'],
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    try {
      const { id, emails } = profile

      if (!emails) {
        console.error('Failed to get emails from profile')
        return null
      }

      const email = emails[0].value

      // TODO: eventually remove this temporary login restriction
      if (
        !/^.*@moment.vip$/.test(email) &&
        !['mailto.jtang@gmail.com', 'jmaathur@gmail.com'].includes(email)
      ) {
        console.error('blocking non-moment email login')
        return null
      }

      let user = await this.usersService.findOneByOAuth(id, 'google')
      if (!user) {
        user = await this.usersService.createOAuthUser(email, 'google', id)
      }

      return user
    } catch (err) {
      console.error('Error occurred while validating:', err)
      return null
    }
  }
}
