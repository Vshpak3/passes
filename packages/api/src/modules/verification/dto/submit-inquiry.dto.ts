import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { PersonaInquiryStatusEnum } from '../enum/persona-inquiry.status.enum'

export class SubmitInquiryRequestDto {
  @IsUUID()
  @ApiProperty()
  personaId: string

  @ApiProperty({ enum: PersonaInquiryStatusEnum })
  personaStatus: PersonaInquiryStatusEnum
}
