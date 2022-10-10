import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { ApiEndpoint } from '../../web/endpoint.web'
import { RoleEnum } from '../auth/core/auth.role'
import { GetFollowResponseDto } from './dto/get-follow.dto'
import { IsFollowingDto } from './dto/is-following.dto'
import { ReportFanDto } from './dto/report-fan.dto'
import {
  GetBlockedResponseDto,
  SearchFansResponseDto,
  SearchFollowingResponseDto,
  SearchFollowRequestDto,
} from './dto/search-follow.dto'
import { FollowService } from './follow.service'

@ApiTags('follow')
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @ApiEndpoint({
    summary: 'Check if you follow a creator',
    responseStatus: HttpStatus.OK,
    responseType: IsFollowingDto,
    responseDesc: 'A follow was checked',
    role: RoleEnum.GENERAL,
  })
  @Get('check/:creatorId')
  async checkFollow(
    @Req() req: RequestWithUser,
    @Param('creatorId') creatorId: string,
  ): Promise<IsFollowingDto> {
    return await this.followService.checkFollow(req.user.id, creatorId)
  }

  @ApiEndpoint({
    summary: 'Creates a follow',
    responseStatus: HttpStatus.CREATED,
    responseType: GetFollowResponseDto,
    responseDesc: 'A follow was created',
    role: RoleEnum.GENERAL,
  })
  @Post(':creatorId')
  async followCreator(
    @Req() req: RequestWithUser,
    @Param('creatorId') creatorId: string,
  ): Promise<GetFollowResponseDto> {
    return await this.followService.followCreator(req.user.id, creatorId)
  }

  @ApiEndpoint({
    summary: 'Deletes a following',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'A following was deleted',
    role: RoleEnum.GENERAL,
  })
  @Delete(':creatorId')
  async unfollowCreator(
    @Req() req: RequestWithUser,
    @Param('creatorId') creatorId: string,
  ): Promise<void> {
    await this.followService.unfollowCreator(req.user.id, creatorId)
  }

  @ApiEndpoint({
    summary: 'Search for followers by query',
    responseStatus: HttpStatus.CREATED,
    responseType: SearchFansResponseDto,
    responseDesc: 'A list of followers was retrieved',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Post('followers/search')
  async searchFans(
    @Req() req: RequestWithUser,
    @Body() searchFanDto: SearchFollowRequestDto,
  ): Promise<SearchFansResponseDto> {
    return new SearchFansResponseDto(
      await this.followService.searchFansByQuery(req.user.id, searchFanDto),
      searchFanDto,
    )
  }

  @ApiEndpoint({
    summary: 'Search for following by query',
    responseStatus: HttpStatus.CREATED,
    responseType: SearchFollowingResponseDto,
    responseDesc: 'A list of following was retrieved',
    role: RoleEnum.GENERAL,
  })
  @Post('following/search')
  async searchFollowing(
    @Req() req: RequestWithUser,
    @Body() searchFanDto: SearchFollowRequestDto,
  ): Promise<SearchFollowingResponseDto> {
    return new SearchFollowingResponseDto(
      await this.followService.searchFollowingByQuery(
        req.user.id,
        searchFanDto,
      ),
      searchFanDto,
    )
  }

  @ApiEndpoint({
    summary: 'Reports a follower',
    responseStatus: HttpStatus.CREATED,
    responseType: undefined,
    responseDesc: 'A follower was reported',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Post('report/:followerId')
  async reportFollower(
    @Req() req: RequestWithUser,
    @Param('followerId') followerId: string,
    @Body() reportFanDto: ReportFanDto,
  ): Promise<void> {
    return await this.followService.reportFollower(
      req.user.id,
      followerId,
      reportFanDto.reason,
    )
  }

  @ApiEndpoint({
    summary: 'Unblocks a follower',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'A follower was unblocked',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Delete('unblock/:followerId')
  async unblockFollower(
    @Req() req: RequestWithUser,
    @Param('followerId') followerId: string,
  ): Promise<void> {
    return await this.followService.unblockFollower(req.user.id, followerId)
  }

  @ApiEndpoint({
    summary: 'Blocks a follower',
    responseStatus: HttpStatus.CREATED,
    responseType: undefined,
    responseDesc: 'A follower was blocked',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Post('block/:followerId')
  async blockFollower(
    @Req() req: RequestWithUser,
    @Param('followerId') followerId: string,
  ): Promise<void> {
    return await this.followService.blockFollower(req.user.id, followerId)
  }

  @ApiEndpoint({
    summary: 'Get blocked followers',
    responseStatus: HttpStatus.OK,
    responseType: GetBlockedResponseDto,
    responseDesc: 'A list of blocked followers was retrieved',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Post('blocked')
  async getBlocked(
    @Req() req: RequestWithUser,
    @Body() searchFanDto: SearchFollowRequestDto,
  ): Promise<GetBlockedResponseDto> {
    return new GetBlockedResponseDto(
      await this.followService.getBlocked(req.user.id),
      searchFanDto,
    )
  }
}
