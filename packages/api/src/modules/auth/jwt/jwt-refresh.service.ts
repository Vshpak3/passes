import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { AuthRecordDto } from '../dto/auth-record-dto'
import { BASE_CLAIMS } from './jwt.constants'
import { JwtRefreshPayload } from './jwt-refresh.payload'

@Injectable()
export class JwtRefreshService {
  constructor(private jwtService: JwtService) {}

  createRefreshToken(authRecord: AuthRecordDto) {
    const payload: JwtRefreshPayload = { sub: authRecord.id, ...BASE_CLAIMS }
    return this.jwtService.sign(payload)
  }
}
