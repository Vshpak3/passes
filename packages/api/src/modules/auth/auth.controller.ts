import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from './jwt/jwt-auth.guard'
import { RequestWithUser } from '../../types'

@Controller('auth')
export class AuthController {
  @Get('user')
  @UseGuards(JwtAuthGuard)
  async testGetUser(@Req() req: RequestWithUser) {
    return { id: req.user.id }
  }
}
