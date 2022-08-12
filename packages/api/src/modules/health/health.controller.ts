import { Controller, Get, HttpStatus } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { AllowUnauthorizedRequest } from '../auth/auth.metadata'

@ApiTags('health')
@Controller('health')
export class HealthController {
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: String,
    description: 'App is running',
  })
  @AllowUnauthorizedRequest()
  @Get()
  health() {
    return 'healthy'
  }
}
