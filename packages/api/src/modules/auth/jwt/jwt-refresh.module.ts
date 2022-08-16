import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { JwtRefreshService } from './jwt-refresh.service'
import { JwtRefreshStrategy } from './jwt-refresh.strategy'

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('jwt.refreshSecret'),
          signOptions: {
            expiresIn: configService.get('jwt.refreshExpiresIn'),
          },
        }
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [JwtRefreshStrategy, JwtRefreshService],
  exports: [JwtModule, JwtRefreshService],
})
export class JwtRefreshModule {}
