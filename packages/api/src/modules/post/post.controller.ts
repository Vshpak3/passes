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
import { PostService } from './post.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger'

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: 'Creates a post' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreatePostDto,
    description: 'A post was created',
  })
  @Post()
  async create(@Body() createPostDto: CreatePostDto): Promise<CreatePostDto> {
    return this.postService.create(createPostDto)
  }

  @ApiOperation({ summary: 'Gets a post' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreatePostDto,
    description: 'A post was retrieved',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CreatePostDto> {
    return this.postService.findOne(id)
  }

  @ApiOperation({ summary: 'Updates a post' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A post was updated',
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto)
  }

  @ApiOperation({ summary: 'Deletes a post' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A post was deleted',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.postService.remove(id)
  }
}
