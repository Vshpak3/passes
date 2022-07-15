import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { GetCurrentUserDto } from './dto/get-current-user'
import { JwtAuthGuard } from './jwt/jwt-auth.guard'
import { JwtAuthService } from './jwt/jwt-auth.service'
import { JwtRefreshGuard } from './jwt/jwt-refresh.guard'
import { JwtRefreshService } from './jwt/jwt-refresh.service'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly jwtRefreshService: JwtRefreshService,
  ) {}

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

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refreshAccessToken(@Req() req: RequestWithUser) {
    return { accessToken: this.jwtAuthService.createAccessToken(req.user.id) }
  }
}
