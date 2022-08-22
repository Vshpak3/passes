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
import { CreateCommentDto } from './dto/create-comment.dto'
import { GetCommentsForPostDto } from './dto/get-comments-for-post-dto'

@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: 'Creates a comment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateCommentDto,
    description: 'A comment was created',
  })
  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CreateCommentDto> {
    return this.commentService.create(req.user.id, createCommentDto)
  }

  @ApiOperation({ summary: 'Gets all comments for a post' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetCommentsForPostDto,
    description: 'A list of comments was retrieved',
  })
  @Get('post/:id')
  async findCommentsForPost(
    @Param('id') id: string,
  ): Promise<GetCommentsForPostDto> {
    return this.commentService.findAllForPost(id)
  }

  @ApiOperation({ summary: 'Gets a comment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateCommentDto,
    description: 'A comment was retrieved',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CreateCommentDto> {
    return this.commentService.findOne(id)
  }

  @ApiOperation({ summary: 'Hides a comment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A comment was hidden',
  })
  @Patch(':id')
  async hide(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.commentService.hide(req.user.id, id)
  }

  @ApiOperation({ summary: 'Deletes a comment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A comment was deleted',
  })
  @Delete(':id')
  async delete(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.commentService.delete(req.user.id, id)
  }
}
