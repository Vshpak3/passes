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
import { CreateFanWallCommentRequestDto } from './dto/create-fan-wall-comment.dto'
import { GetFanWallForCreatorResponseDto } from './dto/get-fan-wall-comments-for-post-dto'
import { FanWallService } from './fan-wall.service'

@ApiTags('fan-wall')
@Controller('fan-wall')
export class FanWallController {
  constructor(private readonly fanWallService: FanWallService) {}

  @ApiOperation({ summary: 'Creates a fan wall comment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'A fan wall comment was created',
  })
  @Post()
  async createFanWallComment(
    @Req() req: RequestWithUser,
    @Body() createFanWallCommentDto: CreateFanWallCommentRequestDto,
  ): Promise<boolean> {
    return this.fanWallService.createFanWallComment(
      req.user.id,
      createFanWallCommentDto,
    )
  }

  @ApiOperation({ summary: 'Gets fan wall for a creator' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetFanWallForCreatorResponseDto,
    description: 'A list of fan wall comments was retrieved',
  })
  @Get(':userId')
  async getFanWallForCreator(
    @Param('userId') userId: string,
  ): Promise<GetFanWallForCreatorResponseDto> {
    return this.fanWallService.getFanWallForCreator(userId)
  }

  @ApiOperation({ summary: 'Hides a fan wall comment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'A fan wall comment was hidden',
  })
  @Patch(':fanWallCommentId')
  async hideFanWallComment(
    @Req() req: RequestWithUser,
    @Param('fanWallCommentId') fanWallCommentId: string,
  ): Promise<boolean> {
    return this.fanWallService.hideFanWallCommment(
      req.user.id,
      fanWallCommentId,
    )
  }

  @ApiOperation({ summary: 'Deletes a fan wall comment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'A fan wall comment was deleted',
  })
  @Delete(':fanWallCommentId')
  async deleteFanWallComment(
    @Req() req: RequestWithUser,
    @Param('fanWallCommentId') fanWallCommentId: string,
  ): Promise<boolean> {
    return this.fanWallService.deleteFanWallComment(
      req.user.id,
      fanWallCommentId,
    )
  }
}
