import { ApiProperty } from '@nestjs/swagger'

import { PersonaInquiryStatusEnum } from '../enum/persona-inquiry.status.enum'

export class SubmitInquiryRequestDto {
  @ApiProperty()
  personaId: string

  @ApiProperty({ enum: PersonaInquiryStatusEnum })
  personaStatus: PersonaInquiryStatusEnum
}
