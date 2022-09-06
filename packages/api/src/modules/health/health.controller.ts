import { Controller, Get, HttpStatus } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { ApiEndpoint } from '../../web/endpoint.web'

@ApiTags('health')
@Controller('health')
export class HealthController {
  @ApiEndpoint({
    summary: 'Health check endpoint',
    responseStatus: HttpStatus.OK,
    responseType: String,
    responseDesc: 'App is running',
    allowUnauthorizedRequest: true,
  })
  @Get()
  health() {
    return 'healthy'
  }
}
