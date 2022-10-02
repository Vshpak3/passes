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
import { BooleanResponseDto } from '../../util/dto/boolean.dto'
import { ApiEndpoint } from '../../web/endpoint.web'
import { RoleEnum } from '../auth/core/auth.role'
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
    responseType: BooleanResponseDto,
    responseDesc: 'A fan wall comment was created',
    role: RoleEnum.GENERAL,
  })
  @Post()
  async createFanWallComment(
    @Req() req: RequestWithUser,
    @Body() createFanWallCommentDto: CreateFanWallCommentRequestDto,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.fanWallService.createFanWallComment(
        req.user.id,
        createFanWallCommentDto,
      ),
    )
  }

  @ApiEndpoint({
    summary: 'Gets fan wall for a creator',
    responseStatus: HttpStatus.OK,
    responseType: GetFanWallResponseDto,
    responseDesc: 'A list of fan wall comments was retrieved',
    role: RoleEnum.GENERAL,
  })
  @Post('profile')
  async getFanWallForCreator(
    @Req() req: RequestWithUser,
    @Body()
    getFanWallRequestDto: GetFanWallRequestDto,
  ): Promise<GetFanWallResponseDto> {
    return await this.fanWallService.getFanWallForCreator(
      req.user.id,
      getFanWallRequestDto,
    )
  }

  @ApiEndpoint({
    summary: 'Hides a fan wall comment',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'A fan wall comment was hidden',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Patch(':fanWallCommentId')
  async hideFanWallComment(
    @Req() req: RequestWithUser,
    @Param('fanWallCommentId') fanWallCommentId: string,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.fanWallService.hideFanWallCommment(
        req.user.id,
        fanWallCommentId,
      ),
    )
  }

  @ApiEndpoint({
    summary: 'Deletes a fan wall comment',
    responseStatus: HttpStatus.OK,
    responseType: BooleanResponseDto,
    responseDesc: 'A fan wall comment was deleted',
    role: RoleEnum.GENERAL,
  })
  @Delete(':fanWallCommentId')
  async deleteFanWallComment(
    @Req() req: RequestWithUser,
    @Param('fanWallCommentId') fanWallCommentId: string,
  ): Promise<BooleanResponseDto> {
    return new BooleanResponseDto(
      await this.fanWallService.deleteFanWallComment(
        req.user.id,
        fanWallCommentId,
      ),
    )
  }
}
