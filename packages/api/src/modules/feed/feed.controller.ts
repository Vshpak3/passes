import { Controller, Get, HttpStatus, Param, Query, Req } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { GetFeedDto } from './dto/get-feed-dto'
import { FeedService } from './feed.service'

@ApiTags('feed')
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @ApiOperation({ summary: 'Gets a users feed' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetFeedDto,
    description: 'A feed of posts was retrieved',
  })
  @Get()
  async getFeed(
    @Req() req: RequestWithUser,
    @Query('cursor') cursor: string,
  ): Promise<GetFeedDto> {
    return this.feedService.getFeed(req.user.id, cursor)
  }

  @ApiOperation({ summary: 'Gets a list of posts for a given creator' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetFeedDto,
    description: 'A list of posts was retrieved',
  })
  @Get('/:username')
  async getPostsForCreator(
    @Param('username') creatorUsername: string,
    @Query('cursor') cursor: string,
  ): Promise<GetFeedDto> {
    return this.feedService.getPostsByCreatorUsername(creatorUsername, cursor)
  }
}
