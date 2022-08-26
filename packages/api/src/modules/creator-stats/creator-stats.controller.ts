import { Body, Controller, Get, HttpStatus, Post, Req } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { CreatorStatsService } from './creator-stats.service'
import { CreatorEarningDto } from './dto/creator-earning.dto'
import { GetCreatorEarningsHistoryDto } from './dto/get-creator-earnings-history.dto'

@ApiTags('creator-stats')
@Controller('creator-stats')
export class CreatorStatsController {
  constructor(private readonly creatorStatsService: CreatorStatsService) {}

  @ApiOperation({ summary: 'Get balance' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreatorEarningDto,
    description: 'Balance was returned',
  })
  @Get('balance')
  async getBalance(@Req() req: RequestWithUser): Promise<CreatorEarningDto> {
    return await this.creatorStatsService.getBalance(req.user.id)
  }

  @ApiOperation({ summary: 'Get historic earnings' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [CreatorEarningDto],
    description: 'Historic earnings returned',
  })
  @Post('earnings/historic')
  async getHistoricEarnings(
    @Req() req: RequestWithUser,
    @Body() getCreatorEarningHistoryDto: GetCreatorEarningsHistoryDto,
  ): Promise<Array<CreatorEarningDto>> {
    return await this.creatorStatsService.getHistoricEarnings(
      req.user.id,
      getCreatorEarningHistoryDto.start,
      getCreatorEarningHistoryDto.end,
      getCreatorEarningHistoryDto.type,
    )
  }
}
