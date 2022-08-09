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
import { GetUserDto } from '../user/dto/get-user.dto'
import { UserEntity } from '../user/entities/user.entity'
import { UserService } from '../user/user.service'
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
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Gets the current authenticated user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetUserDto,
    description: 'Gets the current authenticated user',
  })
  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Req() req: RequestWithUser) {
    return new GetUserDto(await this.userService.findOne(req.user.id), true)
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refreshAccessToken(@Req() req: RequestWithUser) {
    return {
      accessToken: this.jwtAuthService.createAccessToken(
        req.user as UserEntity,
      ),
    }
  }
}
