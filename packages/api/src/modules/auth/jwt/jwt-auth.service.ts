import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { AuthRecordDto } from '../dto/auth-record-dto'
import { BASE_CLAIMS } from './jwt.constants'
import { JwtAuthPayload } from './jwt-auth.payload'

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  createAccessToken(authRecord: AuthRecordDto) {
    const payload: JwtAuthPayload = {
      sub: authRecord.id,
      isVerified: this.isVerified(authRecord),
      isCreator: !!authRecord.isCreator,
      isEmailVerified: !!authRecord.isEmailVerified,
      ...BASE_CLAIMS,
    }
    return this.jwtService.sign(payload)
  }

  isVerified(authRecord: AuthRecordDto): boolean {
    return (
      !!authRecord.birthday &&
      !!authRecord.countryCode &&
      !!authRecord.legalFullName
    )
  }
}
