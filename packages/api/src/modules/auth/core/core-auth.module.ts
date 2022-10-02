import { Module } from '@nestjs/common'

import { EmailModule } from '../../email/email.module'
import { S3ContentModule } from '../../s3content/s3content.module'
import { UserModule } from '../../user/user.module'
import { JwtModule } from '../jwt/jwt.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [EmailModule, JwtModule, S3ContentModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class CoreAuthModule {}
