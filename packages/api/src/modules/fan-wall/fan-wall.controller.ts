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
import { CommentDto } from './dto/comment.dto'
import { CreateFanWallCommentRequestDto } from './dto/create-comment.dto'
import { GetFanWallForCreatorResponseDto } from './dto/get-comments-for-post-dto'
import { FanWallService } from './fan-wall.service'

@ApiTags('fan-wall')
@Controller('fan-wall')
export class FanWallController {
  constructor(private readonly fanWallService: FanWallService) {}

  @ApiOperation({ summary: 'Creates a fan wall comment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CommentDto,
    description: 'A fan wall comment was created',
  })
  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createCommentDto: CreateFanWallCommentRequestDto,
  ) {
    return this.fanWallService.create(req.user.id, createCommentDto)
  }

  @ApiOperation({ summary: 'Gets fan wall for a creator' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetFanWallForCreatorResponseDto,
    description: 'A list of fan wall comments was retrieved',
  })
  @Get(':username')
  async getFanWallForCreator(
    @Param('username') username: string,
  ): Promise<GetFanWallForCreatorResponseDto> {
    return this.fanWallService.findAllForCreator(username)
  }

  @ApiOperation({ summary: 'Hides a comment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A comment was hidden',
  })
  @Patch(':id')
  async hide(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.fanWallService.hide(req.user.id, id)
  }

  @ApiOperation({ summary: 'Deletes a comment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A comment was deleted',
  })
  @Delete(':id')
  async delete(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.fanWallService.delete(req.user.id, id)
  }
}
