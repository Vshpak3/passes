import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Profile, Strategy } from 'passport-google-oauth20'
import { Logger } from 'winston'

import { MetricsService } from '../../../monitoring/metrics/metric.service'
import { UserService } from '../../user/user.service'

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly metrics: MetricsService,
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
    const failureEvid = 'login.failure.google'
    try {
      const { id, emails } = profile

      if (!emails) {
        this.logger.error('Failed to get emails from profile')
        this.metrics.increment(failureEvid)
        return null
      }

      const email = emails[0].value

      // TODO: eventually remove this temporary login restriction
      if (
        !/^.*@moment.vip$/.test(email) &&
        ![
          'mailto.jtang@gmail.com',
          'jmaathur@gmail.com',
          'beratsalija@gmail.com',
          'kelmendtairi@gmail.com',
        ].includes(email)
      ) {
        this.logger.error('blocking non-moment email login')
        this.metrics.increment(failureEvid)
        return null
      }

      let user = await this.usersService.findOneByOAuth(id, 'google')
      if (!user) {
        user = await this.usersService.createOAuthUser(email, 'google', id)
      }

      this.metrics.increment('login.success.google')
      return user
    } catch (err) {
      this.logger.error('Error occurred while validating:', err)
      this.metrics.increment(failureEvid)
      return null
    }
  }
}
