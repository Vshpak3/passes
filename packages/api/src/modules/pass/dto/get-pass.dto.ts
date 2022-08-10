import { ApiProperty } from '@nestjs/swagger'

export class GetPassDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  creatorId: string

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

  constructor(passEntity) {
    this.id = passEntity.id
    this.creatorId = passEntity.owner_id
    this.solNftCollectionId = passEntity.sol_nft_collection_id
    this.title = passEntity.title
    this.description = passEntity.description
    this.imageUrl = passEntity.image_url
    this.type = passEntity.type
    this.price = passEntity.price
    this.totalSupply = passEntity.total_supply
  }
}
