export class GetPassDto {
  id: string
  creatorId: string
  solNftCollectionId: string
  title: string
  description: string
  imageUrl: string
  type: 'subscription' | 'lifetime'
  price: number
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
