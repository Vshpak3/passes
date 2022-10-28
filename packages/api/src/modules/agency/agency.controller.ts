import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { AgencyService } from './agency.service'

@ApiTags('post')
@Controller('post')
export class AgencyController {
  constructor(private readonly agencyService: AgencyService) {}
}
