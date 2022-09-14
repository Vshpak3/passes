import { DtoProperty } from '../../../../web/dto.web'

export class CircleMetaDataDto {
  @DtoProperty({ optional: true })
  email?: string

  @DtoProperty({ optional: true })
  phoneNumber?: string

  @DtoProperty({ optional: true })
  sessionId?: string

  @DtoProperty({ optional: true })
  ipAddress?: string

  @DtoProperty({ optional: true })
  beneficiaryEmail?: string
}
