import {
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
import { LikeService } from './like.service'

@ApiTags('like')
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @ApiOperation({ summary: 'Check if post is liked' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'A like was created',
  })
  @Get(':postId')
  async checkLike(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
  ): Promise<boolean> {
    return await this.likeService.checkLike(req.user.id, postId)
  }

  @ApiOperation({ summary: 'Creates a like on a post' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A like was created',
  })
  @Post(':postId')
  async likePost(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
  ): Promise<void> {
    await this.likeService.likePost(req.user.id, postId)
  }

  @ApiOperation({ summary: 'Removes a like on a post' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A like was deleted',
  })
  @Delete(':postId')
  async unlikePost(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
  ): Promise<void> {
    await this.likeService.unlikePost(req.user.id, postId)
  }
}
