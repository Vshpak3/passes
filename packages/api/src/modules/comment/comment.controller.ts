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
    type: CreateCommentRequestDto,
    description: 'A comment was created',
  })
  @Post()
  async createComment(
    @Req() req: RequestWithUser,
    @Body() createCommentDto: CreateCommentRequestDto,
  ): Promise<CreateCommentRequestDto> {
    return this.commentService.createComment(req.user.id, createCommentDto)
  }

  @ApiOperation({ summary: 'Gets all comments for a post' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetCommentsForPostResponseDto,
    description: 'A list of comments was retrieved',
  })
  @Get('post/:commentId')
  async findCommentsForPost(
    @Param('commentId') commentId: string,
  ): Promise<GetCommentsForPostResponseDto> {
    return this.commentService.findCommentsForPost(commentId)
  }

  @ApiOperation({ summary: 'Gets a comment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateCommentRequestDto,
    description: 'A comment was retrieved',
  })
  @Get('find/:commentId')
  async findComment(
    @Param('commentId') commentId: string,
  ): Promise<CreateCommentRequestDto> {
    return this.commentService.findComment(commentId)
  }

  @ApiOperation({ summary: 'Hides a comment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A comment was hidden',
  })
  @Patch('hide/:commentId')
  async hideComment(
    @Req() req: RequestWithUser,
    @Param('commentId') commentId: string,
  ) {
    return this.commentService.hideComment(req.user.id, commentId)
  }

  @ApiOperation({ summary: 'Deletes a comment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A comment was deleted',
  })
  @Delete('delete/:commentId')
  async deleteComment(
    @Req() req: RequestWithUser,
    @Param('commentId') commentId: string,
  ) {
    return this.commentService.deleteComment(req.user.id, commentId)
  }
}
