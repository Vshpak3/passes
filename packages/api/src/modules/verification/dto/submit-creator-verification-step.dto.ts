import { DtoProperty } from '../../../web/dto.web'
import { CreatorVerificationStepEnum } from '../enum/creator-verification.enum'

export class SubmitCreatorVerificationStepRequestDto {
  @DtoProperty({ custom_type: CreatorVerificationStepEnum })
  step: CreatorVerificationStepEnum
}
