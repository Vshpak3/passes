import { DtoProperty } from '../../../web/endpoint.web'
import { CreatorVerificationStepEnum } from '../enum/creator-verification.enum'

export class SubmitCreatorVerificationStepRequestDto {
  @DtoProperty({ enum: CreatorVerificationStepEnum })
  step: CreatorVerificationStepEnum
}
