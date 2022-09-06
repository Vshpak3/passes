import { ApiProperty } from '@nestjs/swagger'

import { CreatorVerificationStepEnum } from '../enum/creator-verification.enum'

export class SubmitCreatorVerificationStepRequestDto {
  @ApiProperty({ enum: CreatorVerificationStepEnum })
  step: CreatorVerificationStepEnum
}
