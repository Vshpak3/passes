import { DtoProperty } from '../../../web/dto.web'
import { KYCStatusEnum } from '../enum/kyc.status.enum'

export class GetPersonaStatusResponseDto {
  @DtoProperty({ enum: KYCStatusEnum })
  status?: KYCStatusEnum
}
