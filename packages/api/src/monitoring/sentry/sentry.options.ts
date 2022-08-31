import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SentryModuleOptions } from '@ntegral/nestjs-sentry'

export const sentryOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<SentryModuleOptions> => ({
    dsn: configService.get('monitoring.sentry_enabled')
      ? configService.get('monitoring.sentry_dsn')
      : undefined,
    environment: configService.get('infra.env'),
    tracesSampleRate: 1.0,
    debug: false,
  }),
  inject: [ConfigService],
}

// list of exceptions to be ignored
const ignoredExceptions = [
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
]
export const sentryInterceptorOptions = {
  filters: [
    // returning true suppresses sentry logs
    ...ignoredExceptions.map((type) => ({ type, filter: () => true })),
    {
      // catch remaining exceptions
      type: Error,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      filter: (exception) => {
        // custom filter code goes here
        return false
      },
    },
  ],
}
