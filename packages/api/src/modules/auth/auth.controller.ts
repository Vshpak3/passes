import { Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types'
import { GetCurrentUserDto } from './dto/get-current-user'
import { JwtAuthGuard } from './jwt/jwt-auth.guard'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @ApiOperation({ summary: 'Gets the current authenticated user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetCurrentUserDto,
    description: 'Gets the current authenticated user',
  })
  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Req() req: RequestWithUser) {
    return { user: req.user }
  }
}
