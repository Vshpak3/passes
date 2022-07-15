import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-twitter'

import { UserService } from '../../user/user.service'

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UserService,
  ) {
    super({
      consumerKey: configService.get('oauth.twitter.consumerKey'),
      consumerSecret: configService.get('oauth.twitter.consumerSecret'),
      callbackURL: configService.get('oauth.twitter.redirect_url'),
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    try {
      const { id } = profile

      let user = await this.usersService.findOneByOAuth(id, 'twitter')
      if (!user) {
        user = await this.usersService.createOAuthUser('', 'twitter', id)
      }

      return user
    } catch (err) {
      console.error('Error occurred while validating:', err)
      return null
    }
  }
}
