import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { CommentService } from './comment.service'
import { CreateCommentRequestDto } from './dto/create-comment.dto'
import { GetCommentsForPostResponseDto } from './dto/get-comments-for-post-dto'

@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: 'Creates a comment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'A comment was created',
  })
  @Post()
  async createComment(
    @Req() req: RequestWithUser,
    @Body() createCommentDto: CreateCommentRequestDto,
  ): Promise<boolean> {
    return this.commentService.createComment(req.user.id, createCommentDto)
  }

  @ApiOperation({ summary: 'Gets all comments for a post' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetCommentsForPostResponseDto,
    description: 'A list of comments was retrieved',
  })
  @Get('post/:postId')
  async findCommentsForPost(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
  ): Promise<GetCommentsForPostResponseDto> {
    return this.commentService.findCommentsForPost(req.user.id, postId)
  }

  @ApiOperation({ summary: 'Hides a comment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'A comment was hidden',
  })
  @Patch('hide/:postId/:commentId')
  async hideComment(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ): Promise<boolean> {
    return this.commentService.hideComment(req.user.id, postId, commentId)
  }

  @ApiOperation({ summary: 'Deletes a comment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'A comment was deleted',
  })
  @Delete('delete/:postId/:commentId')
  async deleteComment(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ): Promise<boolean> {
    return this.commentService.deleteComment(req.user.id, postId, commentId)
  }
}
