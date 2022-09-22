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
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { ApiEndpoint } from '../../web/endpoint.web'
import { PayinDataDto } from '../payment/dto/payin-data.dto'
import { RegisterPayinResponseDto } from '../payment/dto/register-payin.dto'
import {
  CreatePostRequestDto,
  CreatePostResponseDto,
} from './dto/create-post.dto'
import { GetPostResponseDto } from './dto/get-post.dto'
import { PurchasePostRequestDto } from './dto/purchase-post-access.dto'
import { TipPostRequestDto } from './dto/tip-post.dto'
import { UpdatePostRequestDto } from './dto/update-post.dto'
import { PostService } from './post.service'

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiEndpoint({
    summary: 'Creates a post',
    responseStatus: HttpStatus.OK,
    responseType: CreatePostResponseDto,
    responseDesc: 'A post was created',
  })
  @Post()
  async createPost(
    @Req() req: RequestWithUser,
    @Body() createPostDto: CreatePostRequestDto,
  ): Promise<CreatePostResponseDto> {
    return await this.postService.createPost(req.user.id, createPostDto)
  }

  @ApiEndpoint({
    summary: 'Gets a post',
    responseStatus: HttpStatus.OK,
    responseType: GetPostResponseDto,
    responseDesc: 'A post was retrieved',
  })
  @Get(':postId')
  async findPost(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
  ): Promise<GetPostResponseDto> {
    return await this.postService.findPost(postId, req.user.id)
  }

  @ApiEndpoint({
    summary: 'Updates a post',
    responseStatus: HttpStatus.OK,
    responseType: Boolean,
    responseDesc: 'A post was updated',
  })
  @Patch(':postId')
  async updatePost(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostRequestDto,
  ): Promise<boolean> {
    return await this.postService.updatePost(req.user.id, postId, updatePostDto)
  }

  @ApiEndpoint({
    summary: 'Deletes a post',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'A post was deleted',
  })
  @Delete(':postId')
  async removePost(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
  ): Promise<void> {
    await this.postService.removePost(req.user.id, postId)
  }

  @ApiEndpoint({
    summary: 'Register purchase post payin',
    responseStatus: HttpStatus.CREATED,
    responseType: RegisterPayinResponseDto,
    responseDesc: 'Purcuase post payin was registered',
  })
  @Post('pay/purchase')
  async registerPurchasePost(
    @Req() req: RequestWithUser,
    @Body() purchasePostRequestDto: PurchasePostRequestDto,
  ): Promise<RegisterPayinResponseDto> {
    return await this.postService.registerPurchasePost(
      req.user.id,
      purchasePostRequestDto.postId,
      purchasePostRequestDto.payinMethod,
    )
  }

  @ApiEndpoint({
    summary: 'Get register purchase post data',
    responseStatus: HttpStatus.OK,
    responseType: PayinDataDto,
    responseDesc: 'Data for register purchase post was retrieved',
  })
  @Post('pay/data/purchase')
  async registerPurchasePostData(
    @Req() req: RequestWithUser,
    @Body() purchasePostRequestDto: PurchasePostRequestDto,
  ): Promise<PayinDataDto> {
    return await this.postService.registerPurchasePostData(
      req.user.id,
      purchasePostRequestDto.postId,
    )
  }

  @ApiEndpoint({
    summary: 'Register tip post payin',
    responseStatus: HttpStatus.OK,
    responseType: RegisterPayinResponseDto,
    responseDesc: 'Tip post payin was registered',
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

  @ApiEndpoint({
    summary: 'Pin a post',
    responseStatus: HttpStatus.OK,
    responseType: Boolean,
    responseDesc: 'A post was pinned',
  })
  @Get('pin/:postId')
  async pinPost(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
  ): Promise<boolean> {
    return await this.postService.pinPost(req.user.id, postId)
  }

  @ApiEndpoint({
    summary: 'Unpin a post',
    responseStatus: HttpStatus.OK,
    responseType: Boolean,
    responseDesc: 'A post was unpinned',
  })
  @Get('unpin/:postId')
  async unpinPost(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
  ): Promise<boolean> {
    return await this.postService.unpinPost(req.user.id, postId)
  }
}
