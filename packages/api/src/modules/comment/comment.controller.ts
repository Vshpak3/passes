import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common'
import { CommentService } from './comment.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger'

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
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CreateCommentDto> {
    return this.commentService.create(createCommentDto)
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

  @ApiOperation({ summary: 'Updates a comment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A comment was updated',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(id, updateCommentDto)
  }

  @ApiOperation({ summary: 'Deletes a comment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A comment was deleted',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.commentService.remove(id)
  }
}
