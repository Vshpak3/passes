import { Controller, Get, HttpStatus } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { ApiEndpoint } from '../../web/endpoint.web'
import { RoleEnum } from '../auth/core/auth.role'

@ApiTags('health')
@Controller('health')
export class HealthController {
  @ApiEndpoint({
    summary: 'Health check endpoint',
    responseStatus: HttpStatus.OK,
    responseType: String,
    responseDesc: 'App is running',
    role: RoleEnum.NO_AUTH,
  })
  @Get()
  health() {
    return 'healthy'
  }
}
