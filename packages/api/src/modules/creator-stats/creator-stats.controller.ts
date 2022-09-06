import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { AllowUnauthorizedRequest } from '../auth/auth.metadata'
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

  @ApiOperation({ summary: 'Get balance' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetCreatorEarningResponseDto,
    description: 'Balance was retrieved',
  })
  @Get('balance')
  async getBalance(
    @Req() req: RequestWithUser,
  ): Promise<GetCreatorEarningResponseDto> {
    return await this.creatorStatsService.getBalance(req.user.id)
  }

  @ApiOperation({ summary: 'Get historic earnings' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetCreatorEarningsResponseDto,
    description: 'Historic earnings was retrieved',
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

  @ApiOperation({ summary: 'Get current stats' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetCreatorStatsResponseDto,
    description: 'Current stats returned',
  })
  @AllowUnauthorizedRequest()
  @Get('stats/:creatorId')
  async getCreatorStats(
    @Param('creatorId') creatorId: string,
  ): Promise<GetCreatorStatsResponseDto> {
    return await this.creatorStatsService.getCreatorStats(creatorId)
  }
}
