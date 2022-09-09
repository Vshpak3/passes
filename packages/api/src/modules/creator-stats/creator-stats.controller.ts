import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { ApiEndpoint } from '../../web/endpoint.web'
import { CreatorStatsService } from './creator-stats.service'
import {
  GetCreatorEarningResponseDto,
  GetCreatorEarningsResponseDto,
} from './dto/get-creator-earnings.dto'
import { GetCreatorEarningsHistoryRequestDto } from './dto/get-creator-earnings-history.dto'
import { GetCreatorStatsResponseDto } from './dto/get-creator-stats.dto'

@ApiTags('creator-stats')
@Controller('creator-stats')
export class CreatorStatsController {
  constructor(private readonly creatorStatsService: CreatorStatsService) {}

  @ApiEndpoint({
    summary: 'Get balance',
    responseStatus: HttpStatus.OK,
    responseType: GetCreatorEarningResponseDto,
    responseDesc: 'Balance was retrieved',
  })
  @Get('balance')
  async getBalance(
    @Req() req: RequestWithUser,
  ): Promise<GetCreatorEarningResponseDto> {
    return await this.creatorStatsService.getBalance(req.user.id)
  }

  @ApiEndpoint({
    summary: 'Get historic earnings',
    responseStatus: HttpStatus.OK,
    responseType: GetCreatorEarningsResponseDto,
    responseDesc: 'Historic earnings was retrieved',
  })
  @Post('earnings/historic')
  async getHistoricEarnings(
    @Req() req: RequestWithUser,
    @Body() getCreatorEarningHistoryDto: GetCreatorEarningsHistoryRequestDto,
  ): Promise<GetCreatorEarningsResponseDto> {
    return new GetCreatorEarningsResponseDto(
      await this.creatorStatsService.getHistoricEarnings(
        req.user.id,
        getCreatorEarningHistoryDto.start,
        getCreatorEarningHistoryDto.end,
        getCreatorEarningHistoryDto.type,
      ),
    )
  }

  @ApiEndpoint({
    summary: 'Get current stats',
    responseStatus: HttpStatus.OK,
    responseType: GetCreatorStatsResponseDto,
    responseDesc: 'Current stats returned',
    allowUnauthorizedRequest: true,
  })
  @Get('stats/:creatorId')
  async getCreatorStats(
    @Req() req: RequestWithUser,
    @Param('creatorId') creatorId: string,
  ): Promise<GetCreatorStatsResponseDto> {
    return await this.creatorStatsService.getCreatorStats(
      creatorId,
      req.user?.id,
    )
  }
}
