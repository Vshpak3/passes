import { JwtModule } from '@nestjs/jwt'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtAuthService } from './jwt-auth.service'
import { JwtAuthStrategy } from './jwt-auth.strategy'

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('jwt.secret'),
          signOptions: {
            expiresIn: configService.get('jwt.expiresIn'),
          },
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [JwtAuthStrategy, JwtAuthService],
  exports: [JwtModule, JwtAuthService],
})
export class JwtAuthModule {}
