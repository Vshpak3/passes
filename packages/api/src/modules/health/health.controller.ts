import { Controller, Get, HttpStatus } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger'

@ApiTags('health')
@Controller('health')
export class HealthController {
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'App is running',
  })
  @Get()
  health() {
    return
  }
}
