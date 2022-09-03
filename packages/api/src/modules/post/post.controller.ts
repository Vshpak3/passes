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
import {
  CreatePostRequestDto,
  CreatePostResponseDto,
} from './dto/create-post.dto'
import { CreatePostAccessRequestDto } from './dto/create-post-access.dto'
import { GetPostResponseDto } from './dto/get-post.dto'
import { TipPostRequestDto } from './dto/tip-post.dto'
import { UpdatePostRequestDto } from './dto/update-post.dto'
import { PostService } from './post.service'

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: 'Creates a post' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreatePostResponseDto,
    description: 'A post was created',
  })
  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createPostDto: CreatePostRequestDto,
  ): Promise<CreatePostResponseDto> {
    return await this.postService.create(req.user.id, createPostDto)
  }

  @ApiOperation({ summary: 'Gets a post' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPostResponseDto,
    description: 'A post was retrieved',
  })
  @Get(':id')
  async findOne(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<GetPostResponseDto> {
    return await this.postService.findOne(id, req.user.id)
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
    @Body() updatePostDto: UpdatePostRequestDto,
  ) {
    return await this.postService.update(req.user.id, id, updatePostDto)
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
    @Body() createPostAccessDto: CreatePostAccessRequestDto,
  ): Promise<RegisterPayinResponseDto> {
    return await this.postService.registerPurchasePost(
      req.user.id,
      createPostAccessDto.postId,
      createPostAccessDto.fromDM,
      createPostAccessDto.payinMethod,
    )
  }

  @ApiOperation({ summary: 'Get register purchase post data' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PayinDataDto,
    description: 'Data for register purchase post was returned',
  })
  @Post('pay/data/purchase')
  async registerPurchasePostData(
    @Req() req: RequestWithUser,
    @Body() createPostAccessDto: CreatePostAccessRequestDto,
  ): Promise<PayinDataDto> {
    return await this.postService.registerPurchasePostData(
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
    @Body() tipPostDto: TipPostRequestDto,
  ): Promise<RegisterPayinResponseDto> {
    return await this.postService.registerTipPost(
      req.user.id,
      tipPostDto.postId,
      tipPostDto.amount,
      tipPostDto.payinMethod,
    )
  }

  @ApiOperation({ summary: 'Pin a post' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'A post was pinned',
  })
  @Get('pin/:postId')
  async pinPost(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
  ): Promise<boolean> {
    return await this.postService.pinPost(req.user.id, postId)
  }

  @ApiOperation({ summary: 'Unpin a post' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'A post was unpinned',
  })
  @Get('unpin/:postId')
  async unpinPost(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
  ): Promise<boolean> {
    return await this.postService.unpinPost(req.user.id, postId)
  }
}
