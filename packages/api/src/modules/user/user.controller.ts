import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { ApiEndpoint } from '../../web/endpoint.web'
import { JwtAuthService } from '../auth/jwt/jwt-auth.service'
import {
  SetInitialUserInfoRequestDto,
  SetInitialUserInfoResponseDto,
} from './dto/init-user.dto'
import {
  SearchCreatorRequestDto,
  SearchCreatorResponseDto,
} from './dto/search-creator.dto'
import { UpdateUsernameRequestDto } from './dto/update-username.dto'
import { VerifyEmailDto } from './dto/verify-email.dto'
import { UserService } from './user.service'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}
  @ApiEndpoint({
    summary: 'Sets initial user info',
    responseStatus: HttpStatus.OK,
    responseType: SetInitialUserInfoResponseDto,
    responseDesc: 'Sets initial user info',
  })
  @Patch()
  async setInitialInfo(
    @Req() req: RequestWithUser,
    @Body() body: SetInitialUserInfoRequestDto,
  ): Promise<SetInitialUserInfoResponseDto> {
    const user = await this.userService.setInitialUserInfo(req.user.id, body)
    const accessToken = this.jwtAuthService.createAccessToken(user)
    return new SetInitialUserInfoResponseDto(accessToken)
  }

  @ApiEndpoint({
    summary: 'Verify email for the current user',
    responseStatus: HttpStatus.OK,
    responseType: null,
    responseDesc: 'A email was verified',
    allowUnauthorizedRequest: true,
  })
  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto): Promise<void> {
    await this.userService.verifyEmail(verifyEmailDto)
  }

  @ApiEndpoint({
    summary: 'Set username for current user',
    responseStatus: HttpStatus.CREATED,
    responseType: null,
    responseDesc: 'A username was set for the current user',
  })
  @Post('username')
  async setUsername(
    @Req() req: RequestWithUser,
    @Body() updateUsernameDto: UpdateUsernameRequestDto,
  ): Promise<void> {
    await this.userService.setUsername(req.user.id, updateUsernameDto.username)
  }

  @ApiEndpoint({
    summary: 'Validates whether a username is available',
    responseStatus: HttpStatus.OK,
    responseType: Boolean,
    responseDesc: 'A username was checked for validity',
    allowUnauthorizedRequest: true,
  })
  @Get('/usernames/validate/:username')
  async validateUsername(
    @Param('username') username: string,
  ): Promise<boolean> {
    return this.userService.validateUsername(username)
  }

  @ApiEndpoint({
    summary: 'Disables a user account',
    responseStatus: HttpStatus.OK,
    responseType: null,
    responseDesc: 'A user account was disabled',
  })
  @Delete()
  async disableUser(@Req() req: RequestWithUser): Promise<void> {
    await this.userService.disableUser(req.user.id)
  }

  @ApiEndpoint({
    summary: 'Search for creators by query',
    responseStatus: HttpStatus.CREATED,
    responseType: SearchCreatorResponseDto,
    responseDesc: 'A list of creators was returned',
  })
  @Post('creator/search')
  async searchCreatorByUsername(
    @Body() searchCreatorDto: SearchCreatorRequestDto,
  ): Promise<SearchCreatorResponseDto> {
    return await this.userService.searchByQuery(searchCreatorDto)
  }

  /*
  -------------------------------------------------------------------------------
  TEST (to be removed)
  -------------------------------------------------------------------------------
  */

  @ApiEndpoint({
    summary: 'Make yourself a creator',
    responseStatus: HttpStatus.OK,
    responseType: null,
    responseDesc: 'You were made a creator',
  })
  @Get('make/creator')
  async makeCreator(@Req() req: RequestWithUser): Promise<void> {
    await this.userService.makeCreator(req.user.id)
  }
}
