import { Controller, Get, HttpStatus, Param } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { GemPackageEntityDto } from './dto/gem-packages.dto'
import { GemService } from './gem.service'

@ApiTags('gem')
@Controller('gem')
export class GemController {
  constructor(private readonly gemService: GemService) {}

  @ApiOperation({ summary: 'Get public gem packages' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [GemPackageEntityDto],
    description: 'public gem packages returned',
  })
  @Get('packages')
  async getPublicPackages(): Promise<Array<GemPackageEntityDto>> {
    return await (
      await this.gemService.getPublicPackages()
    ).map((entity) => {
      return new GemPackageEntityDto(entity)
    })
  }

  @ApiOperation({ summary: 'Get public gem packages' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GemPackageEntityDto,
    description: 'gem package info returned',
  })
  @Get('package/:id')
  async getPackage(@Param('id') id: string): Promise<GemPackageEntityDto> {
    return new GemPackageEntityDto(await this.gemService.getPackage(id))
  }
}
