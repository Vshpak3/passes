import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PassTypeEnum } from '../enum/pass.enum'
export class PassDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @IsUUID()
  @DtoProperty()
  creatorId: string

  @DtoProperty()
  title: string

  @DtoProperty()
  description: string

  @DtoProperty({ enum: PassTypeEnum })
  type: PassTypeEnum

  @DtoProperty()
  price: number

  @DtoProperty({ required: false })
  duration?: number

  @DtoProperty()
  totalSupply: number

  @DtoProperty()
  remainingSupply: number

  @DtoProperty()
  freetrial: boolean

  @DtoProperty({ required: false })
  pinnedAt?: Date

  @DtoProperty({ required: false })
  expiresAt?: Date

  @DtoProperty({ required: false })
  creatorUsername?: string

  @DtoProperty({ required: false })
  creatorDisplayName?: string

  constructor(pass) {
    this.id = pass.id
    this.creatorId = pass.creator_id
    this.title = pass.title
    this.description = pass.description
    this.type = pass.type
    this.duration = pass.duration
    this.totalSupply = pass.total_supply
    this.remainingSupply = pass.remaining_supply
    this.freetrial = pass.freetrial
    this.pinnedAt = pass.pinned_at
    this.price = pass.price
    this.totalSupply = pass.total_supply

    this.creatorUsername = pass.creator_username
    this.creatorDisplayName = pass.creator_display_name

    this.expiresAt = pass.pass_holder_expires_at
  }
}
