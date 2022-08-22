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
import { PayinDataDto } from '../payment/dto/payin-data.dto'
import { RegisterPayinResponseDto } from '../payment/dto/register-payin.dto'
import { CreatePostDto } from './dto/create-post.dto'
import { CreatePostAccessDto } from './dto/create-post-access.dto'
import { GetPostDto } from './dto/get-post.dto'
import { TipPostDto } from './dto/tip-post.dto'
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
    type: undefined,
    description: 'A post was deleted',
  })
  @Delete(':id')
  async remove(
    @Req() req: RequestWithUser,
    @Param('id') postId: string,
  ): Promise<void> {
    await this.postService.remove(req.user.id, postId)
  }

  @ApiOperation({ summary: 'Register purchase post payin' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: RegisterPayinResponseDto,
    description: 'Purcuase post payin was registered',
  })
  @Post('pay/purchase')
  async registerPurchasePost(
    @Req() req: RequestWithUser,
    @Body() createPostAccessDto: CreatePostAccessDto,
  ): Promise<RegisterPayinResponseDto> {
    return this.postService.registerPurchasePost(
      req.user.id,
      createPostAccessDto.postId,
      createPostAccessDto.payinMethod,
    )
  }

  @ApiOperation({ summary: 'Get register purchase post data' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RegisterPayinResponseDto,
    description: 'Data for register purchase post was returned',
  })
  @Get('pay/data/purchase')
  async registerPurchasePostData(
    @Req() req: RequestWithUser,
    @Body() createPostAccessDto: CreatePostAccessDto,
  ): Promise<PayinDataDto> {
    return this.postService.registerPurchasePostData(
      req.user.id,
      createPostAccessDto.postId,
    )
  }

  @ApiOperation({ summary: 'Register tip post payin' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RegisterPayinResponseDto,
    description: 'Tip post payin was registered',
  })
  @Post('pay/tip')
  async registerTipPost(
    @Req() req: RequestWithUser,
    @Body() tipPostDto: TipPostDto,
  ): Promise<RegisterPayinResponseDto> {
    return this.postService.registerTipPost(
      req.user.id,
      tipPostDto.postId,
      tipPostDto.amount,
      tipPostDto.payinMethod,
    )
  }
}
