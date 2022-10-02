import { ConfigService } from '@nestjs/config'

export const jwtAuthConfig = {
  useFactory: (configService: ConfigService) => {
    return {
      secret: configService.get('jwt.authSecret'),
      signOptions: {
        expiresIn: configService.get('jwt.authExpiresIn'),
      },
    }
  },
  inject: [ConfigService],
}

export const jwtRefreshConfig = {
  useFactory: (configService: ConfigService) => {
    return {
      secret: configService.get('jwt.refreshSecret'),
      signOptions: {
        expiresIn: configService.get('jwt.refreshExpiresIn'),
      },
    }
  },
  inject: [ConfigService],
}
