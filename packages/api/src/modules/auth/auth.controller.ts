import { Controller, Get, Req, UseGuards } from '@nestjs/common'

import { RequestWithUser } from '../../types'
import { JwtAuthGuard } from './jwt/jwt-auth.guard'

@Controller('auth')
export class AuthController {
  @Get('user')
  @UseGuards(JwtAuthGuard)
  async testGetUser(@Req() req: RequestWithUser) {
    return { id: req.user.id }
  }
}
