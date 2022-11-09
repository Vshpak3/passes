import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SentryModuleOptions } from '@ntegral/nestjs-sentry'
import ms from 'ms'

export const sentryOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<SentryModuleOptions> => ({
    dsn: configService.get('monitoring.sentryEnabled')
      ? configService.get('monitoring.sentryDsn')
      : undefined,
    environment: configService.get('infra.env'),
    tracesSampleRate: 1.0,
    debug: false,
    close: {
      enabled: true,
      timeout: ms('2 seconds'),
    },
  }),
  inject: [ConfigService],
}

// List of exceptions to be ignored
const ignoredExceptions = [
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
]
export const sentryInterceptorOptions = {
  filters: [
    {
      type: HttpException,
      filter: (exception: unknown) => {
        // If thrown exception extends one of the ignored exception types then we return true
        // Returning true suppresses sentry logs:
        // https://github.com/ntegral/nestjs-sentry/blob/f80c538/lib/sentry.interceptor.ts#L111
        return ignoredExceptions.some((type) => exception instanceof type)
      },
    },
  ],
}
