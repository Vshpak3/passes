import { DtoProperty } from '../../../web/endpoint.web'

export class PassHolderDto {
  @DtoProperty()
  passHolderId: string

  @DtoProperty()
  passId: string

  @DtoProperty()
  holderId: string

  @DtoProperty({ required: false })
  messages?: number | null

  @DtoProperty({ required: false })
  expiresAt?: Date

  @DtoProperty({ required: false })
  holderUsername?: string

  @DtoProperty({ required: false })
  holderDisplayName?: string

  constructor(passHolder) {
    this.passHolderId = passHolder.id
    this.passId = passHolder.pass_id
    this.holderId = passHolder.holder_id
    this.expiresAt = passHolder.expires_at

    this.holderUsername = passHolder.username
    this.holderDisplayName = passHolder.display_name
  }
}
