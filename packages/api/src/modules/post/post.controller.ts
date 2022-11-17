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
import { BooleanResponseDto } from '../../util/dto/boolean.dto'
import { ApiEndpoint } from '../../web/endpoint.web'
import { RoleEnum } from '../auth/core/auth.role'
import { PayinDataDto } from '../payment/dto/payin-data.dto'
import { RegisterPayinResponseDto } from '../payment/dto/register-payin.dto'
import {
  CreatePostRequestDto,
  CreatePostResponseDto,
} from './dto/create-post.dto'
import {
  CreatePostCategoryRequestDto,
  CreatePostCategoryResponseDto,
} from './dto/create-post-category.dto'
import { DeletePostCategoryRequestDto } from './dto/delete-post-category.dto'
import { EditPostRequestDto } from './dto/edit-post.dto'
import { EditPostCategoryRequestDto } from './dto/edit-post-category.dto'
import { GetPostResponseDto } from './dto/get-post.dto'
import {
  GetPostBuyersRequestDto,
  GetPostBuyersResponseDto,
} from './dto/get-post-buyers.dto'
import {
  GetPostHistoryRequestDto,
  GetPostHistoryResponseDto,
} from './dto/get-post-history.dto'
import { GetPostsRequestDto, GetPostsResponseDto } from './dto/get-posts.dto'
import { PostToCategoryRequestDto } from './dto/post-to-category.dto'
import { PurchasePostRequestDto } from './dto/purchase-post-access.dto'
import { TipPostRequestDto } from './dto/tip-post.dto'
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
    role: RoleEnum.CREATOR_ONLY,
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
    role: RoleEnum.NO_AUTH,
  })
  @Get(':postId')
  async findPost(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
  ): Promise<GetPostResponseDto> {
    return await this.postService.findPost(postId, req.user?.id ?? '')
  }

  @ApiEndpoint({
    summary: 'Edits a post',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'A post was edited',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Patch('edit')
  async editPost(
    @Req() req: RequestWithUser,
    @Body() editPostDto: EditPostRequestDto,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.postService.editPost(req.user.id, editPostDto),
    )
  }

  @ApiEndpoint({
    summary: 'Deletes a post',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'A post was deleted',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Delete('remove/:postId')
  async removePost(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
  ): Promise<void> {
    await this.postService.removePost(req.user.id, postId)
  }

  @ApiEndpoint({
    summary: 'Hide a deleted post',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'A post was hidden',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Delete('hide/:postId')
  async hidePost(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
  ): Promise<void> {
    await this.postService.hidePost(req.user.id, postId)
  }

  @ApiEndpoint({
    summary: 'Register purchase post payin',
    responseStatus: HttpStatus.CREATED,
    responseType: RegisterPayinResponseDto,
    responseDesc: 'Purcuase post payin was registered',
    role: RoleEnum.GENERAL,
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
    role: RoleEnum.GENERAL,
  })
  @Post('pay/data/purchase')
  async registerPurchasePostData(
    @Req() req: RequestWithUser,
    @Body() purchasePostRequestDto: PurchasePostRequestDto,
  ): Promise<PayinDataDto> {
    return await this.postService.registerPurchasePostData(
      req.user.id,
      purchasePostRequestDto.postId,
      purchasePostRequestDto.payinMethod,
    )
  }

  @ApiEndpoint({
    summary: 'Register tip post payin',
    responseStatus: HttpStatus.OK,
    responseType: RegisterPayinResponseDto,
    responseDesc: 'Tip post payin was registered',
    role: RoleEnum.GENERAL,
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
    responseType: BooleanResponseDto,
    responseDesc: 'A post was pinned',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Get('pin/:postId')
  async pinPost(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.postService.pinPost(req.user.id, postId),
    )
  }

  @ApiEndpoint({
    summary: 'Unpin a post',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'A post was unpinned',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Get('unpin/:postId')
  async unpinPost(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.postService.unpinPost(req.user.id, postId),
    )
  }

  @ApiEndpoint({
    summary: 'Get post history',
    responseStatus: HttpStatus.OK,
    responseType: GetPostHistoryResponseDto,
    responseDesc: 'Post history was retrieved',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Post('history')
  async getPostHistory(
    @Req() req: RequestWithUser,
    @Body() getPostHistoryRequestDto: GetPostHistoryRequestDto,
  ): Promise<GetPostHistoryResponseDto> {
    return new GetPostHistoryResponseDto(
      await this.postService.getPostHistory(
        req.user.id,
        getPostHistoryRequestDto,
      ),
    )
  }

  @ApiEndpoint({
    summary: 'Gets posts',
    responseStatus: HttpStatus.OK,
    responseType: GetPostsResponseDto,
    responseDesc: 'A list of posts was retrieved',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Post('posts')
  async getPosts(
    @Req() req: RequestWithUser,
    @Body() getPostsRequestDto: GetPostsRequestDto,
  ): Promise<GetPostsResponseDto> {
    return new GetPostsResponseDto(
      await this.postService.getPosts(req.user.id, getPostsRequestDto),
      getPostsRequestDto,
    )
  }

  @ApiEndpoint({
    summary: 'Gets purchased',
    responseStatus: HttpStatus.OK,
    responseType: GetPostBuyersResponseDto,
    responseDesc: 'A list of buyers',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Post('purchased')
  async getPostBuyers(
    @Req() req: RequestWithUser,
    @Body() getPostsBuyersRequestDto: GetPostBuyersRequestDto,
  ): Promise<GetPostBuyersResponseDto> {
    return new GetPostBuyersResponseDto(
      await this.postService.getPostBuyers(
        req.user.id,
        getPostsBuyersRequestDto,
      ),
      getPostsBuyersRequestDto,
    )
  }

  @ApiEndpoint({
    summary: 'Create post category',
    responseStatus: HttpStatus.OK,
    responseType: CreatePostCategoryResponseDto,
    responseDesc: 'Post category created',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Post('category/create')
  async createPostCategory(
    @Req() req: RequestWithUser,
    @Body() createPostCategoryRequestDto: CreatePostCategoryRequestDto,
  ): Promise<CreatePostCategoryResponseDto> {
    return new CreatePostCategoryResponseDto(
      await this.postService.createPostCategory(
        req.user.id,
        createPostCategoryRequestDto,
      ),
    )
  }

  @ApiEndpoint({
    summary: 'Edit post category',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Post category editted',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Post('category/edit')
  async editPostCategory(
    @Req() req: RequestWithUser,
    @Body() editPostCategoryRequestDto: EditPostCategoryRequestDto,
  ): Promise<void> {
    await this.postService.editPostCategory(
      req.user.id,
      editPostCategoryRequestDto,
    )
  }

  @ApiEndpoint({
    summary: 'Delete post category',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Post category deleted',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Post('category/delette')
  async deletePostCategory(
    @Req() req: RequestWithUser,
    @Body() deletePostCategoryRequestDto: DeletePostCategoryRequestDto,
  ): Promise<void> {
    await this.postService.deletePostCategory(
      req.user.id,
      deletePostCategoryRequestDto,
    )
  }

  @ApiEndpoint({
    summary: 'Add post to category',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Post added to category',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Post('category/post/add')
  async addPostToCategory(
    @Req() req: RequestWithUser,
    @Body() postToCategoryRequestDto: PostToCategoryRequestDto,
  ): Promise<void> {
    await this.postService.addPostToCategory(
      req.user.id,
      postToCategoryRequestDto,
    )
  }

  @ApiEndpoint({
    summary: 'Remove post from category',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Post removed from category',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Post('category/post/remove')
  async removePostFromCategory(
    @Req() req: RequestWithUser,
    @Body() postToCategoryRequestDto: PostToCategoryRequestDto,
  ): Promise<void> {
    await this.postService.removePostFromCategory(
      req.user.id,
      postToCategoryRequestDto,
    )
  }
}
