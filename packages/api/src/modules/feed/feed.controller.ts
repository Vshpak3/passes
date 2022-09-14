import { Body, Controller, Get, HttpStatus, Post, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { ApiEndpoint } from '../../web/endpoint.web'
import { GetFeedRequesteDto, GetFeedResponseDto } from './dto/get-feed-dto'
import { GetPostsRequesteDto } from './dto/get-posts.dto'
import { GetProfileFeedRequesteDto } from './dto/get-profile-feed.dto'
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
  })
  @Post()
  async getFeed(
    @Req() req: RequestWithUser,
    @Body() getFeedRequesteDto: GetFeedRequesteDto,
  ): Promise<GetFeedResponseDto> {
    return this.feedService.getFeed(req.user.id, getFeedRequesteDto)
  }

  @ApiEndpoint({
    summary: 'Gets a feed for a given creator',
    responseStatus: HttpStatus.OK,
    responseType: GetFeedResponseDto,
    responseDesc: 'A feed was retrieved',
  })
  @Post('profile')
  async getFeedForCreator(
    @Req() req: RequestWithUser,
    @Body() getProfileFeedRequesteDto: GetProfileFeedRequesteDto,
  ): Promise<GetFeedResponseDto> {
    return this.feedService.getFeedForCreator(
      req.user.id,
      getProfileFeedRequesteDto,
    )
  }

  @ApiEndpoint({
    summary: 'Gets my posts',
    responseStatus: HttpStatus.OK,
    responseType: GetFeedResponseDto,
    responseDesc: 'A list of posts was retrieved',
  })
  @Post('owner/posts')
  async getPostsForOwner(
    @Req() req: RequestWithUser,
    @Body() getPostsRequesteDto: GetPostsRequesteDto,
  ): Promise<GetFeedResponseDto> {
    return this.feedService.getPostsForOwner(
      req.user.id,
      false,
      getPostsRequesteDto,
    )
  }

  @ApiEndpoint({
    summary: 'Gets my messages',
    responseStatus: HttpStatus.OK,
    responseType: GetFeedResponseDto,
    responseDesc: 'A list of messages was retrieved',
  })
  @Get('owner/messages')
  async getMessagesForOwner(
    @Req() req: RequestWithUser,
    @Body() getPostsRequesteDto: GetPostsRequesteDto,
  ): Promise<GetFeedResponseDto> {
    return this.feedService.getPostsForOwner(
      req.user.id,
      true,
      getPostsRequesteDto,
    )
  }
}
