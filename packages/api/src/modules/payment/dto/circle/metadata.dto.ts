import { DtoProperty } from '../../../../web/dto.web'

export class CircleMetaDataDto {
  @DtoProperty({ type: 'string', optional: true })
  email?: string

  @DtoProperty({ type: 'string', optional: true })
  phoneNumber?: string

  @DtoProperty({ type: 'string', optional: true })
  sessionId?: string

  @DtoProperty({ type: 'string', optional: true })
  ipAddress?: string

  @DtoProperty({ type: 'string', optional: true })
  beneficiaryEmail?: string
}
