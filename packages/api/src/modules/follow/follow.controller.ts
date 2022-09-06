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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { GetFansResponseDto } from './dto/get-fan.dto'
import { GetFollowingResponseDto } from './dto/get-following.dto'
import { ReportFanDto } from './dto/report-fan.dto'
import { SearchFanRequestDto } from './dto/search-fan.dto'
import { FollowService } from './follow.service'

@ApiTags('follow')
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @ApiOperation({ summary: 'Check if you follow a creator' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'A follow was checked',
  })
  @Get('check/:creatorId')
  async checkFollow(
    @Req() req: RequestWithUser,
    @Param('creatorId') creatorId: string,
  ): Promise<boolean> {
    return await this.followService.checkFollow(req.user.id, creatorId)
  }

  @ApiOperation({ summary: 'Creates a follow' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: GetFollowingResponseDto,
    description: 'A follow was created',
  })
  @Post(':creatorId')
  async followCreator(
    @Req() req: RequestWithUser,
    @Param('creatorId') creatorId: string,
  ): Promise<GetFollowingResponseDto> {
    return await this.followService.followCreator(req.user.id, creatorId)
  }

  @ApiOperation({ summary: 'Deletes a following' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A following was deleted',
  })
  @Delete(':creatorId')
  async unfollowCreator(
    @Req() req: RequestWithUser,
    @Param('creatorId') creatorId: string,
  ): Promise<void> {
    await this.followService.unfollowCreator(req.user.id, creatorId)
  }

  @ApiOperation({ summary: 'Search for followers by query' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: GetFansResponseDto,
    description: 'A list of followers was retrieved',
  })
  @Post('search')
  async searchFans(
    @Req() req: RequestWithUser,
    @Body() searchFanDto: SearchFanRequestDto,
  ): Promise<GetFansResponseDto> {
    return new GetFansResponseDto(
      await this.followService.searchByQuery(req.user.id, searchFanDto),
    )
  }

  @ApiOperation({ summary: 'Reports a follower' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: undefined,
    description: 'A follower was reported',
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

  @ApiOperation({ summary: 'Unblocks a follower' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A follower was unblocked',
  })
  @Post('unblock/:followerId')
  async unblockFollower(
    @Req() req: RequestWithUser,
    @Param('followerId') followerId: string,
  ): Promise<void> {
    return this.followService.unblockFollower(req.user.id, followerId)
  }

  @ApiOperation({ summary: 'Blocks a follower' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: undefined,
    description: 'A follower was blocked',
  })
  @Post('block/:followerId')
  async blockFollower(
    @Req() req: RequestWithUser,
    @Param('followerId') followerId: string,
  ): Promise<void> {
    return this.followService.blockFollower(req.user.id, followerId)
  }
}
