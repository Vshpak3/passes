import { Controller, Get, HttpStatus } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { GemPackagesDto } from './dto/gem-packages.dto'
import { GemService } from './gem.service'

@ApiTags('gem')
@Controller('gem')
export class GemController {
  constructor(private readonly gemService: GemService) {}

  @ApiOperation({ summary: 'Get public gem packages' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GemPackagesDto,
    description: 'public gem packages returned',
  })
  @Get('key')
  async getPublicPackages(): Promise<GemPackagesDto> {
    const dto = new GemPackagesDto()
    dto.packages = await this.gemService.getPublicPackages()
    return dto
  }
}
