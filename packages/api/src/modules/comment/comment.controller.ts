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
import { BooleanResponseDto } from '../../util/dto/boolean.dto'
import { ApiEndpoint } from '../../web/endpoint.web'
import { RoleEnum } from '../auth/core/auth.role'
import { CommentService } from './comment.service'
import { CreateCommentRequestDto } from './dto/create-comment.dto'
import {
  GetCommentsForPostRequestDto,
  GetCommentsForPostResponseDto,
} from './dto/get-comments-for-post-dto'

@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiEndpoint({
    summary: 'Creates a comment',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'A comment was created',
    role: RoleEnum.GENERAL,
  })
  @Post()
  async createComment(
    @Req() req: RequestWithUser,
    @Body() createCommentDto: CreateCommentRequestDto,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.commentService.createComment(req.user.id, createCommentDto),
    )
  }

  @ApiEndpoint({
    summary: 'Gets all comments for a post',
    responseStatus: HttpStatus.OK,
    responseType: GetCommentsForPostResponseDto,
    responseDesc: 'A list of comments was retrieved',
    role: RoleEnum.GENERAL,
  })
  @Post('post')
  async findCommentsForPost(
    @Req() req: RequestWithUser,
    @Body() getCommentsForPostRequestDto: GetCommentsForPostRequestDto,
  ): Promise<GetCommentsForPostResponseDto> {
    return await this.commentService.findCommentsForPost(
      req.user.id,
      getCommentsForPostRequestDto,
    )
  }

  @ApiEndpoint({
    summary: 'Hides a comment',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'A comment was hidden',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Patch('hide/:postId/:commentId')
  async hideComment(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.commentService.hideComment(req.user.id, postId, commentId),
    )
  }

  @ApiEndpoint({
    summary: 'Deletes a comment',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'A comment was deleted',
    role: RoleEnum.GENERAL,
  })
  @Delete('delete/:postId/:commentId')
  async deleteComment(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.commentService.deleteComment(req.user.id, postId, commentId),
    )
  }
}
