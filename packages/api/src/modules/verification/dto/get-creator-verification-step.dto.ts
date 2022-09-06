import { DtoProperty } from '../../../web/dto.web'
import { CreatorVerificationStepEnum } from '../enum/creator-verification.enum'

export class GetCreatorVerificationStepResponseDto {
  @DtoProperty({ enum: CreatorVerificationStepEnum })
  step: CreatorVerificationStepEnum
}
