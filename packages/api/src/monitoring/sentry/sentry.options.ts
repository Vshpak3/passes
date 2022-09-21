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
    {
      type: HttpException,
      filter: (exception: any) => {
        // if thrown exception extends any of the ignored exception types return true
        // returning true suppresses sentry logs
        return !!ignoredExceptions.some((type) => exception instanceof type)
      },
    },
  ],
}
