import { DtoProperty } from '../../../web/dto.web'
import { KYCStatusEnum } from '../enum/kyc.status.enum'
export class GetPersonaStatusResponseDto {
  @DtoProperty({ custom_type: KYCStatusEnum })
  status?: KYCStatusEnum
}
