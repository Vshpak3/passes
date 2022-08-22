import {
  Controller,
  Delete,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { LikeService } from './like.service'

@ApiTags('like')
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @ApiOperation({ summary: 'Creates a like on a post' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A like was created',
  })
  @Post(':id')
  async create(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.likeService.create(req.user.id, id)
  }

  @ApiOperation({ summary: 'Removes a like on a post' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A like was deleted',
  })
  @Delete(':id')
  async delete(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.likeService.delete(req.user.id, id)
  }
}
