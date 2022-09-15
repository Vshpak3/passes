import { Body, Controller, Get, HttpStatus, Post, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { ApiEndpoint } from '../../web/endpoint.web'
import { GetFeedRequestDto, GetFeedResponseDto } from './dto/get-feed-dto'
import { GetPostsRequestDto } from './dto/get-posts.dto'
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
  })
  @Post()
  async getFeed(
    @Req() req: RequestWithUser,
    @Body() getFeedRequestDto: GetFeedRequestDto,
  ): Promise<GetFeedResponseDto> {
    return this.feedService.getFeed(req.user.id, getFeedRequestDto)
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
    @Body() getProfileFeedRequestDto: GetProfileFeedRequestDto,
  ): Promise<GetFeedResponseDto> {
    return this.feedService.getFeedForCreator(
      req.user.id,
      getProfileFeedRequestDto,
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
    @Body() getPostsRequestDto: GetPostsRequestDto,
  ): Promise<GetFeedResponseDto> {
    return this.feedService.getPostsForOwner(
      req.user.id,
      false,
      getPostsRequestDto,
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
    @Body() getPostsRequestDto: GetPostsRequestDto,
  ): Promise<GetFeedResponseDto> {
    return this.feedService.getPostsForOwner(
      req.user.id,
      true,
      getPostsRequestDto,
    )
  }
}
