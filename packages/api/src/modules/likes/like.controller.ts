import {
  Controller,
  Delete,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { ApiEndpoint } from '../../web/endpoint.web'
import { RoleEnum } from '../auth/core/auth.metadata'
import { LikeService } from './like.service'

@ApiTags('like')
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @ApiEndpoint({
    summary: 'Creates a like on a post',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'A like was created',
    role: RoleEnum.GENERAL,
  })
  @Post(':postId')
  async likePost(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
  ): Promise<void> {
    await this.likeService.likePost(req.user.id, postId)
  }

  @ApiEndpoint({
    summary: 'Removes a like on a post',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'A like was deleted',
    role: RoleEnum.GENERAL,
  })
  @Delete(':postId')
  async unlikePost(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
  ): Promise<void> {
    await this.likeService.unlikePost(req.user.id, postId)
  }
}
