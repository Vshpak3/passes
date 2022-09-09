import { DtoProperty } from '../../../web/dto.web'
import { ChainEnum } from '../../wallet/enum/chain.enum'
import { PassTypeEnum } from '../enum/pass.enum'

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

  @DtoProperty()
  totalSupply: number

  @DtoProperty()
  remainingSupply: number

  @DtoProperty()
  address: string

  @DtoProperty({ enum: ChainEnum })
  chain: ChainEnum

  @DtoProperty({ required: false })
  tokenId?: string

  @DtoProperty({ enum: PassTypeEnum })
  type: PassTypeEnum

  @DtoProperty()
  title: string

  @DtoProperty()
  description: string

  @DtoProperty({ required: false })
  creatorId?: string

  @DtoProperty({ required: false })
  creatorUsername?: string

  @DtoProperty({ required: false })
  creatorDisplayName?: string

  constructor(passHolder) {
    this.passHolderId = passHolder.id
    this.passId = passHolder.pass_id
    this.holderId = passHolder.holder_id
    this.expiresAt = passHolder.expires_at
    this.messages = passHolder.messages

    this.holderUsername = passHolder.holder_username
    this.holderDisplayName = passHolder.holder_display_name

    this.type = passHolder.type
    this.title = passHolder.title
    this.description = passHolder.description
    this.totalSupply = passHolder.total_supply
    this.remainingSupply = passHolder.remainingSupply
    this.creatorId = passHolder.creator_id
    this.creatorUsername = passHolder.creator_username
    this.creatorDisplayName = passHolder.creator_display_name
  }
}
