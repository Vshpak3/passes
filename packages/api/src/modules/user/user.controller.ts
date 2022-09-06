import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { ApiEndpoint } from '../../web/endpoint.web'
import { JwtAuthService } from '../auth/jwt/jwt-auth.service'
import { GetUserResponseDto } from './dto/get-user.dto'
import { SetInitialUserInfoRequestDto } from './dto/init-user.dto'
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
    summary: 'Gets a user',
    responseStatus: HttpStatus.OK,
    responseType: GetUserResponseDto,
    responseDesc: 'A user was retrieved',
  })
  @Get(':userId')
  async findOne(@Param('userId') userId: string): Promise<GetUserResponseDto> {
    return new GetUserResponseDto(await this.userService.findOne(userId))
  }

  @ApiEndpoint({
    summary: 'Sets initial user info',
    responseStatus: HttpStatus.OK,
    responseType: GetUserResponseDto,
    responseDesc: 'Sets initial user info',
  })
  @Patch()
  async setInitialInfo(
    @Req() req: RequestWithUser,
    @Body() body: SetInitialUserInfoRequestDto,
  ) {
    const user = await this.userService.setInitialUserInfo(req.user.id, body)

    // Issue a new access token since the user now is verified
    if (!this.jwtAuthService.isVerified(user)) {
      throw new InternalServerErrorException(
        'User is not verified but should be',
      )
    }
    const accessToken = this.jwtAuthService.createAccessToken(user)

    return { accessToken }
  }

  @ApiEndpoint({
    summary: 'Disables a user account',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'A user account was disabled',
  })
  @Delete()
  async delete(@Req() req: RequestWithUser): Promise<GetUserResponseDto> {
    return new GetUserResponseDto(await this.userService.remove(req.user.id))
  }

  @ApiEndpoint({
    summary: 'Verify email for the current user',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'A email was verified',
    allowUnauthorizedRequest: true,
  })
  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    await this.userService.verifyEmail(verifyEmailDto)
  }

  @ApiEndpoint({
    summary: 'Set username for current user',
    responseStatus: HttpStatus.CREATED,
    responseType: undefined,
    responseDesc: 'A username was set for the current user',
  })
  @Post('username')
  async setUsername(
    @Req() req: RequestWithUser,
    @Body() updateUsernameDto: UpdateUsernameRequestDto,
  ): Promise<GetUserResponseDto> {
    const updatedUser = await this.userService.setUsername(
      req.user.id,
      updateUsernameDto.username,
    )
    return new GetUserResponseDto(updatedUser)
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
    summary: 'Search for creators by query',
    responseStatus: HttpStatus.CREATED,
    responseType: SearchCreatorResponseDto,
    responseDesc: 'A list of creators was returned',
  })
  @Post('creator/search')
  async searchCreatorByUsername(
    @Body() searchCreatorDto: SearchCreatorRequestDto,
  ): Promise<any> {
    const creators = await this.userService.searchByQuery(searchCreatorDto)
    return new SearchCreatorResponseDto(creators)
  }

  /*
  -------------------------------------------------------------------------------
  TEST (to be removed)
  -------------------------------------------------------------------------------
  */

  @ApiEndpoint({
    summary: 'Make yourself a creator',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'You were made a creator',
  })
  @Get('make/creator')
  async makeCreator(@Req() req: RequestWithUser): Promise<void> {
    return await this.userService.makeCreator(req.user.id)
  }
}
