import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { PostService } from './post.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('post')
@Controller('api/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: 'TODO' })
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto)
  }

  @ApiOperation({ summary: 'TODO' })
  @Get()
  findAll() {
    return this.postService.findAll()
  }

  @ApiOperation({ summary: 'TODO' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id)
  }

  @ApiOperation({ summary: 'TODO' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto)
  }

  @ApiOperation({ summary: 'TODO' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id)
  }
}
