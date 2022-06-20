import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { CommentService } from './comment.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('comment')
@Controller('api/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: 'TODO' })
  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto)
  }

  @ApiOperation({ summary: 'TODO' })
  @Get()
  findAll() {
    return this.commentService.findAll()
  }

  @ApiOperation({ summary: 'TODO' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id)
  }

  @ApiOperation({ summary: 'TODO' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto)
  }

  @ApiOperation({ summary: 'TODO' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id)
  }
}
