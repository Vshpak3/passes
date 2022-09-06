import { ApiProperty } from '@nestjs/swagger'

import { CreatorVerificationStepEnum } from '../enum/creator-verification.enum'

export class GetCreatorVerificationStepResponseDto {
  @ApiProperty({ enum: CreatorVerificationStepEnum })
  step: CreatorVerificationStepEnum
}
