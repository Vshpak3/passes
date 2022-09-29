import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { ApiEndpoint } from '../../web/endpoint.web'
import { RoleEnum } from '../auth/core/auth.metadata'
import { GetFeedRequestDto, GetFeedResponseDto } from './dto/get-feed-dto'
import { GetProfileFeedRequestDto } from './dto/get-profile-feed.dto'
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
    return await this.feedService.getFeed(req.user.id, getFeedRequestDto)
  }

  @ApiEndpoint({
    summary: 'Gets a feed for a given creator',
    responseStatus: HttpStatus.OK,
    responseType: GetFeedResponseDto,
    responseDesc: 'A feed was retrieved',
    role: RoleEnum.GENERAL,
  })
  @Post('profile')
  async getFeedForCreator(
    @Req() req: RequestWithUser,
    @Body() getProfileFeedRequestDto: GetProfileFeedRequestDto,
  ): Promise<GetFeedResponseDto> {
    return await this.feedService.getFeedForCreator(
      req.user.id,
      getProfileFeedRequestDto,
    )
  }
}
