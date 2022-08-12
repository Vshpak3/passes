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
import { CreatePostDto } from './dto/create-post.dto'
import { GetPostDto } from './dto/get-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PostService } from './post.service'

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
  async create(
    @Req() req: RequestWithUser,
    @Body() createPostDto: CreatePostDto,
  ): Promise<CreatePostDto> {
    return this.postService.create(req.user.id, createPostDto)
  }

  @ApiOperation({ summary: 'Gets a post' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPostDto,
    description: 'A post was retrieved',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetPostDto> {
    return this.postService.findOne(id)
  }

  @ApiOperation({ summary: 'Updates a post' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A post was updated',
  })
  @Patch(':id')
  async update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(req.user.id, id, updatePostDto)
  }

  @ApiOperation({ summary: 'Deletes a post' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPostDto,
    description: 'A post was deleted',
  })
  @Delete(':id')
  async remove(@Req() req: RequestWithUser, @Param('id') postId: string) {
    return this.postService.remove(req.user.id, postId)
  }
}
