import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'
export class PassDto {
  @IsUUID()
  @ApiProperty()
  id: string

  @IsUUID()
  @ApiProperty()
  creatorId: string

  @IsUUID()
  @ApiProperty()
  solNftCollectionId: string

  @ApiProperty()
  title: string

  @ApiProperty()
  description: string

  @ApiProperty()
  imageUrl: string

  @ApiProperty()
  type: 'subscription' | 'lifetime'

  @ApiProperty()
  price: number

  @ApiProperty()
  totalSupply: number

  @ApiPropertyOptional()
  creatorUsername?: string

  @ApiPropertyOptional()
  creatorDisplayName?: string

  @ApiPropertyOptional()
  expiresAt?: Date

  constructor(pass) {
    this.id = pass.id
    this.creatorId = pass.owner_id
    this.solNftCollectionId = pass.sol_nft_collection_id
    this.title = pass.title
    this.description = pass.description
    this.imageUrl = pass.image_url
    this.type = pass.type
    this.price = pass.price
    this.totalSupply = pass.total_supply

    this.creatorUsername = pass.creator_username
    this.creatorDisplayName = pass.creator_display_name

    this.expiresAt = pass.pass_holder_expires_at
  }
}
