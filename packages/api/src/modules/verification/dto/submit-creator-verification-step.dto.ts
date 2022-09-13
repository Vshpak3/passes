import { IsEnum } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { CreatorVerificationStepEnum } from '../enum/creator-verification.enum'

export class SubmitCreatorVerificationStepRequestDto {
  @IsEnum(CreatorVerificationStepEnum)
  @DtoProperty({ enum: CreatorVerificationStepEnum })
  step: CreatorVerificationStepEnum
}
