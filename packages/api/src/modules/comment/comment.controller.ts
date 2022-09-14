import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { ApiEndpoint } from '../../web/endpoint.web'
import { CommentService } from './comment.service'
import { CreateCommentRequestDto } from './dto/create-comment.dto'
import {
  GetCommentsForPostRequesteDto,
  GetCommentsForPostResponseDto,
} from './dto/get-comments-for-post-dto'

@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiEndpoint({
    summary: 'Creates a comment',
    responseStatus: HttpStatus.OK,
    responseType: Boolean,
    responseDesc: 'A comment was created',
  })
  @Post()
  async createComment(
    @Req() req: RequestWithUser,
    @Body() createCommentDto: CreateCommentRequestDto,
  ): Promise<boolean> {
    return this.commentService.createComment(req.user.id, createCommentDto)
  }

  @ApiEndpoint({
    summary: 'Gets all comments for a post',
    responseStatus: HttpStatus.OK,
    responseType: GetCommentsForPostResponseDto,
    responseDesc: 'A list of comments was retrieved',
  })
  @Post('post')
  async findCommentsForPost(
    @Req() req: RequestWithUser,
    @Body() getCommentsForPostRequesteDto: GetCommentsForPostRequesteDto,
  ): Promise<GetCommentsForPostResponseDto> {
    return this.commentService.findCommentsForPost(
      req.user.id,
      getCommentsForPostRequesteDto,
    )
  }

  @ApiEndpoint({
    summary: 'Hides a comment',
    responseStatus: HttpStatus.OK,
    responseType: Boolean,
    responseDesc: 'A comment was hidden',
  })
  @Patch('hide/:postId/:commentId')
  async hideComment(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ): Promise<boolean> {
    return this.commentService.hideComment(req.user.id, postId, commentId)
  }

  @ApiEndpoint({
    summary: 'Deletes a comment',
    responseStatus: HttpStatus.OK,
    responseType: Boolean,
    responseDesc: 'A comment was deleted',
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
