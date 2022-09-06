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
import { CreateFanWallCommentRequestDto } from './dto/create-fan-wall-comment.dto'
import { GetFanWallForCreatorResponseDto } from './dto/get-fan-wall-comments-for-post-dto'
import { FanWallService } from './fan-wall.service'

@ApiTags('fan-wall')
@Controller('fan-wall')
export class FanWallController {
  constructor(private readonly fanWallService: FanWallService) {}

  @ApiEndpoint({
    summary: 'Creates a fan wall comment',
    responseStatus: HttpStatus.OK,
    responseType: Boolean,
    responseDesc: 'A fan wall comment was created',
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

  @ApiEndpoint({
    summary: 'Gets fan wall for a creator',
    responseStatus: HttpStatus.OK,
    responseType: GetFanWallForCreatorResponseDto,
    responseDesc: 'A list of fan wall comments was retrieved',
  })
  @Get(':userId')
  async getFanWallForCreator(
    @Param('userId') userId: string,
  ): Promise<GetFanWallForCreatorResponseDto> {
    return this.fanWallService.getFanWallForCreator(userId)
  }

  @ApiEndpoint({
    summary: 'Hides a fan wall comment',
    responseStatus: HttpStatus.OK,
    responseType: Boolean,
    responseDesc: 'A fan wall comment was hidden',
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

  @ApiEndpoint({
    summary: 'Deletes a fan wall comment',
    responseStatus: HttpStatus.OK,
    responseType: Boolean,
    responseDesc: 'A fan wall comment was deleted',
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
