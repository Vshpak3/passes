import { IsEnum } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { KYCStatusEnum } from '../enum/kyc.status.enum'
export class GetPersonaStatusResponseDto {
  @IsEnum(KYCStatusEnum)
  @DtoProperty({ enum: KYCStatusEnum })
  status?: KYCStatusEnum
}
