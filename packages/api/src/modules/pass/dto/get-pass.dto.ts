import { PassEntity } from '../entities/pass.entity'

export class GetPassDto {
  creatorId: string
  collectionId: string
  title: string
  description: string
  imageUrl: string
  type: 'subscription' | 'lifetime'
  price: number
  totalSupply: number

  constructor(passEntity: PassEntity) {
    this.creatorId = passEntity.owner.id
    this.collectionId = passEntity.collection.id
    this.title = passEntity.title
    this.description = passEntity.description
    this.imageUrl = passEntity.imageUrl
    this.type = passEntity.type
    this.price = passEntity.price
    this.totalSupply = passEntity.totalSupply
  }
}
