import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PERSONA_ID_LENGTH } from '../constants/schema'
import { PersonaInquiryStatusEnum } from '../enum/persona-inquiry.status.enum'

export class SubmitPersonaInquiryRequestDto {
  @Length(1, PERSONA_ID_LENGTH)
  @DtoProperty({ type: 'string' })
  personaId: string

  @DtoProperty({ custom_type: PersonaInquiryStatusEnum })
  personaStatus: PersonaInquiryStatusEnum
}
