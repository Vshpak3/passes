import { DtoProperty } from '../../../web/endpoint.web'
import { PersonaInquiryStatusEnum } from '../enum/persona-inquiry.status.enum'

export class SubmitPersonaInquiryRequestDto {
  // Not a UUID
  @DtoProperty()
  personaId: string

  @DtoProperty({ enum: PersonaInquiryStatusEnum })
  personaStatus: PersonaInquiryStatusEnum
}
