import { Controller, Get, HttpStatus, Param, Query, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { ApiEndpoint } from '../../web/endpoint.web'
import { GetFeedResponseDto } from './dto/get-feed-dto'
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
  @Get()
  async getFeed(
    @Req() req: RequestWithUser,
    @Query('cursor') cursor: string,
  ): Promise<GetFeedResponseDto> {
    return this.feedService.getFeed(req.user.id, cursor)
  }

  @ApiEndpoint({
    summary: 'Gets a feed for a given creator',
    responseStatus: HttpStatus.OK,
    responseType: GetFeedResponseDto,
    responseDesc: 'A feed was retrieved',
  })
  @Get('profile/:userId')
  async getFeedForCreator(
    @Req() req: RequestWithUser,
    @Param('userId') userId: string,
    @Query('cursor') cursor: string,
  ): Promise<GetFeedResponseDto> {
    return this.feedService.getFeedForCreator(userId, req.user.id, cursor)
  }

  @ApiEndpoint({
    summary: 'Gets my posts',
    responseStatus: HttpStatus.OK,
    responseType: GetFeedResponseDto,
    responseDesc: 'A list of posts was retrieved',
  })
  @Get('owner/posts')
  async getPostsForOwner(
    @Req() req: RequestWithUser,
    @Param('scheduledOnly') scheduledOnly: boolean,
    @Query('cursor') cursor: string,
  ): Promise<GetFeedResponseDto> {
    return this.feedService.getPostsForOwner(
      req.user.id,
      false,
      scheduledOnly,
      cursor,
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
    @Query('cursor') cursor: string,
  ): Promise<GetFeedResponseDto> {
    return this.feedService.getPostsForOwner(req.user.id, true, false, cursor)
  }
}
