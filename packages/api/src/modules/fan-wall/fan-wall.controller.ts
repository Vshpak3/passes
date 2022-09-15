import {
  Body,
  Controller,
  Delete,
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
import {
  GetFanWallRequestDto,
  GetFanWallResponseDto,
} from './dto/get-fan-wall-comments.dto'
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
    responseType: GetFanWallResponseDto,
    responseDesc: 'A list of fan wall comments was retrieved',
  })
  @Post('profile')
  async getFanWallForCreator(
    @Req() req: RequestWithUser,
    @Body()
    getFanWallRequestDto: GetFanWallRequestDto,
  ): Promise<GetFanWallResponseDto> {
    return this.fanWallService.getFanWallForCreator(
      req.user.id,
      getFanWallRequestDto,
    )
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
