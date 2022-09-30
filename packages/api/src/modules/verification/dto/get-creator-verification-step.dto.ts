import { DtoProperty } from '../../../web/dto.web'
import { CreatorVerificationStepEnum } from '../enum/creator-verification.enum'

export class GetCreatorVerificationStepResponseDto {
  @DtoProperty({ custom_type: CreatorVerificationStepEnum })
  step: CreatorVerificationStepEnum

  @DtoProperty({ type: 'string', optional: true })
  accessToken?: string
}
