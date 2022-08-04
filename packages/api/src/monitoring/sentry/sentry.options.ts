import { ConfigService } from '@nestjs/config'
import { SentryModuleOptions } from '@ntegral/nestjs-sentry'

export const sentryOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<SentryModuleOptions> =>
    (function tmpLog(): SentryModuleOptions {
      let options = {
        dsn: configService.get('monitoring.sentry_dsn'),
        environment: configService.get('infra.env'),
        tracesSampleRate: 1.0,
        debug: false,
      }
      console.log(options)
      return options
    })(),
  inject: [ConfigService],
}
