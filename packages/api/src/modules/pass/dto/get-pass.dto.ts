import { PassEntity } from '../entities/pass.entity'

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

  constructor(passEntity: PassEntity) {
    this.id = passEntity.id
    this.creatorId = passEntity.owner.id
    this.solNftCollectionId = passEntity.solNftCollection.id
    this.title = passEntity.title
    this.description = passEntity.description
    this.imageUrl = passEntity.imageUrl
    this.type = passEntity.type
    this.price = passEntity.price
    this.totalSupply = passEntity.totalSupply
  }
}
