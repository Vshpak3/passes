import { ApiProperty } from '@nestjs/swagger'

import { PersonaInquiryStatusEnum } from '../enum/persona-inquiry.status.enum'

export class SubmitInquiryRequestDto {
  // Not a UUID
  @ApiProperty()
  personaId: string

  @ApiProperty({ enum: PersonaInquiryStatusEnum })
  personaStatus: PersonaInquiryStatusEnum
}
