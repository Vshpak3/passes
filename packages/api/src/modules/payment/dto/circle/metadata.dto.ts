import { DtoProperty } from '../../../../web/endpoint.web'

export class CircleMetaDataDto {
  @DtoProperty({ required: false })
  email?: string

  @DtoProperty({ required: false })
  phoneNumber?: string

  @DtoProperty({ required: false })
  sessionId?: string

  @DtoProperty({ required: false })
  ipAddress?: string

  @DtoProperty({ required: false })
  beneficiaryEmail?: string
}
