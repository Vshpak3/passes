import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { ApiEndpoint } from '../../web/endpoint.web'
import { RoleEnum } from '../auth/core/auth.role'
import { GetFeedRequestDto, GetFeedResponseDto } from './dto/get-feed-dto'
import {
  GetProfileFeedRequestDto,
  GetProfileFeedResponseDto,
} from './dto/get-profile-feed.dto'
import { FeedService } from './feed.service'

@ApiTags('feed')
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @ApiEndpoint({
    summary: 'Gets a users feed',
    responseStatus: HttpStatus.OK,
    responseType: GetFeedResponseDto,
    responseDesc: 'A feed of posts was retrieved',
    role: RoleEnum.GENERAL,
  })
  @Post()
  async getFeed(
    @Req() req: RequestWithUser,
    @Body() getFeedRequestDto: GetFeedRequestDto,
  ): Promise<GetFeedResponseDto> {
    return new GetFeedResponseDto(
      await this.feedService.getAllPosts(req.user.id, getFeedRequestDto),
      getFeedRequestDto,
    )
  }

  @ApiEndpoint({
    summary: 'Gets a feed for a given creator',
    responseStatus: HttpStatus.OK,
    responseType: GetProfileFeedResponseDto,
    responseDesc: 'A feed was retrieved',
    role: RoleEnum.NO_AUTH,
  })
  @Post('profile')
  async getFeedForCreator(
    @Req() req: RequestWithUser,
    @Body() getProfileFeedRequestDto: GetProfileFeedRequestDto,
  ): Promise<GetProfileFeedResponseDto> {
    return new GetProfileFeedResponseDto(
      await this.feedService.getFeedForCreator(
        getProfileFeedRequestDto,
        req?.user.id,
      ),
      getProfileFeedRequestDto,
    )
  }
}
