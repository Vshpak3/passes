import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { BooleanResponseDto } from '../../util/dto/boolean.dto'
import { ApiEndpoint } from '../../web/endpoint.web'
import { RoleEnum } from '../auth/core/auth.role'
import { IsPasswordUserResponseDto } from './dto/is-password.dto'
import {
  SearchCreatorRequestDto,
  SearchCreatorResponseDto,
} from './dto/search-creator.dto'
import { UpdateDisplayNameRequestDto } from './dto/update-display-name.dto'
import { UpdateUsernameRequestDto } from './dto/update-username.dto'
import { UserService } from './user.service'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiEndpoint({
    summary: 'patrick whitelisted users',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'patrick pass',
    role: RoleEnum.GENERAL,
  })
  @Post('patrick')
  async patrickWhitelist(@Req() req: RequestWithUser): Promise<void> {
    await this.userService.createWhitelistedPasses(req.user.id)
  }

  @ApiEndpoint({
    summary: 'Set username for current user',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'A username was set for the current user',
    role: RoleEnum.GENERAL,
  })
  @Patch('set-username')
  async setUsername(
    @Req() req: RequestWithUser,
    @Body() updateUsernameDto: UpdateUsernameRequestDto,
  ): Promise<void> {
    await this.userService.setUsername(req.user.id, updateUsernameDto.username)
  }

  @ApiEndpoint({
    summary: 'Set display name for current user',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'A display name was set for the current user',
    role: RoleEnum.GENERAL,
  })
  @Patch('set-display-name')
  async setDisplayName(
    @Req() req: RequestWithUser,
    @Body() updateDisplayNameRequestDto: UpdateDisplayNameRequestDto,
  ): Promise<void> {
    await this.userService.setDisplayName(
      req.user.id,
      updateDisplayNameRequestDto.displayName,
    )
  }

  @ApiEndpoint({
    summary: 'Validates whether a username is available',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'A username was checked for validity',
    role: RoleEnum.NO_AUTH,
  })
  @Post('username/validate')
  async isUsernameTaken(
    @Body() checkUsernameDto: UpdateUsernameRequestDto,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.userService.isUsernameTaken(checkUsernameDto.username),
    )
  }

  @ApiEndpoint({
    summary: 'Deactivate a user account',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'A user account was deactivated',
    role: RoleEnum.GENERAL,
  })
  @Get('deactivate')
  async deactivateUser(
    @Req() req: RequestWithUser,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.userService.deactivateUser(req.user.id),
    )
  }

  @ApiEndpoint({
    summary: 'Activate a user account',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'A user account was activated',
    role: RoleEnum.GENERAL,
  })
  @Get('activate')
  async activateUser(@Req() req: RequestWithUser): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.userService.activateUser(req.user.id),
    )
  }

  @ApiEndpoint({
    summary: 'Search for creators by query',
    responseStatus: HttpStatus.OK,
    responseType: SearchCreatorResponseDto,
    responseDesc: 'A list of creators was returned',
    role: RoleEnum.GENERAL,
  })
  @Post('creator/search')
  async searchCreator(
    @Body() searchCreatorDto: SearchCreatorRequestDto,
  ): Promise<SearchCreatorResponseDto> {
    return await this.userService.searchByQuery(searchCreatorDto)
  }

  @ApiEndpoint({
    summary: 'Check if user is a creator',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'User checked for creator status',
    role: RoleEnum.GENERAL,
  })
  @Get('creator/check/:userId')
  async isCreator(
    @Param('userId') userId: string,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(await this.userService.isCreator(userId))
  }

  @ApiEndpoint({
    summary: 'Flags self as adult',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Self was marked as adult',
    role: RoleEnum.GENERAL,
  })
  @Get('adult')
  async makeAdult(@Req() req: RequestWithUser): Promise<void> {
    await this.userService.makeAdult(req.user.id)
  }

  @ApiEndpoint({
    summary: 'Get user id from username',
    responseStatus: HttpStatus.OK,
    responseType: String,
    responseDesc: 'User id retrieved',
    role: RoleEnum.GENERAL,
  })
  @Get('username/:username')
  async getUserId(@Param('username') username: string): Promise<string> {
    return await this.userService.getIdFromUsername(username)
  }

  @ApiEndpoint({
    summary: 'Get user id from username',
    responseStatus: HttpStatus.OK,
    responseType: String,
    responseDesc: 'User id retrieved',
    role: RoleEnum.GENERAL,
  })
  @Get('user-id/:userId')
  async getUsernameFromId(@Param('userId') userId: string): Promise<string> {
    return await this.userService.getUsernameFromId(userId)
  }

  @ApiEndpoint({
    summary: 'Get if user uses a password',
    responseStatus: HttpStatus.OK,
    responseType: IsPasswordUserResponseDto,
    responseDesc: 'If user uses a password retrieved',
    role: RoleEnum.GENERAL,
  })
  @Get('is-password')
  async isPasswordUser(
    @Req() req: RequestWithUser,
  ): Promise<IsPasswordUserResponseDto> {
    return new IsPasswordUserResponseDto(
      await this.userService.isPasswordUser(req.user.id),
    )
  }
}
