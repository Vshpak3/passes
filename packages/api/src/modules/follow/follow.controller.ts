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
import { GetListMembersResponseDto } from '../list/dto/get-list-members.dto'
import { GetFollowResponseDto } from './dto/get-follow.dto'
import { ReportFanDto } from './dto/report-fan.dto'
import { SearchFollowRequestDto } from './dto/search-fan.dto'
import { FollowService } from './follow.service'

@ApiTags('follow')
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @ApiEndpoint({
    summary: 'Check if you follow a creator',
    responseStatus: HttpStatus.OK,
    responseType: Boolean,
    responseDesc: 'A follow was checked',
  })
  @Get('check/:creatorId')
  async checkFollow(
    @Req() req: RequestWithUser,
    @Param('creatorId') creatorId: string,
  ): Promise<boolean> {
    return await this.followService.checkFollow(req.user.id, creatorId)
  }

  @ApiEndpoint({
    summary: 'Creates a follow',
    responseStatus: HttpStatus.CREATED,
    responseType: GetFollowResponseDto,
    responseDesc: 'A follow was created',
  })
  @Post('follow/:creatorId')
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
    responseType: GetListMembersResponseDto,
    responseDesc: 'A list of followers was retrieved',
  })
  @Post('search')
  async searchFans(
    @Req() req: RequestWithUser,
    @Body() searchFanDto: SearchFollowRequestDto,
  ): Promise<GetListMembersResponseDto> {
    return new GetListMembersResponseDto(
      await this.followService.searchFansByQuery(req.user.id, searchFanDto),
    )
  }

  @ApiEndpoint({
    summary: 'Search for following by query',
    responseStatus: HttpStatus.CREATED,
    responseType: GetListMembersResponseDto,
    responseDesc: 'A list of following was retrieved',
  })
  @Post('search')
  async searchFollowing(
    @Req() req: RequestWithUser,
    @Body() searchFanDto: SearchFollowRequestDto,
  ): Promise<GetListMembersResponseDto> {
    return new GetListMembersResponseDto(
      await this.followService.searchFollowingByQuery(
        req.user.id,
        searchFanDto,
      ),
    )
  }

  @ApiEndpoint({
    summary: 'Reports a follower',
    responseStatus: HttpStatus.CREATED,
    responseType: undefined,
    responseDesc: 'A follower was reported',
  })
  @Post('report/:followerId')
  async reportFollower(
    @Req() req: RequestWithUser,
    @Param('followerId') followerId: string,
    @Body() reportFanDto: ReportFanDto,
  ): Promise<void> {
    return this.followService.reportFollower(
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
  })
  @Post('unblock/:followerId')
  async unblockFollower(
    @Req() req: RequestWithUser,
    @Param('followerId') followerId: string,
  ): Promise<void> {
    return this.followService.unblockFollower(req.user.id, followerId)
  }

  @ApiEndpoint({
    summary: 'Blocks a follower',
    responseStatus: HttpStatus.CREATED,
    responseType: undefined,
    responseDesc: 'A follower was blocked',
  })
  @Post('block/:followerId')
  async blockFollower(
    @Req() req: RequestWithUser,
    @Param('followerId') followerId: string,
  ): Promise<void> {
    return this.followService.blockFollower(req.user.id, followerId)
  }
}
