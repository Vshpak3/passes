import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
export class PassDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @IsUUID()
  @DtoProperty()
  creatorId: string

  @IsUUID()
  @DtoProperty()
  solNftCollectionId: string

  @DtoProperty()
  title: string

  @DtoProperty()
  description: string

  @DtoProperty()
  type: 'subscription' | 'lifetime'

  @DtoProperty()
  price: number

  @DtoProperty()
  totalSupply: number

  @DtoProperty({ required: false })
  creatorUsername?: string

  @DtoProperty({ required: false })
  creatorDisplayName?: string

  @DtoProperty({ required: false })
  expiresAt?: Date

  constructor(pass) {
    this.id = pass.id
    this.creatorId = pass.owner_id
    this.solNftCollectionId = pass.sol_nft_collection_id
    this.title = pass.title
    this.description = pass.description
    this.type = pass.type
    this.price = pass.price
    this.totalSupply = pass.total_supply

    this.creatorUsername = pass.creator_username
    this.creatorDisplayName = pass.creator_display_name

    this.expiresAt = pass.pass_holder_expires_at
  }
}
