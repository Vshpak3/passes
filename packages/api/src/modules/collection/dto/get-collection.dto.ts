import { GetPassDto } from '../../pass/dto/get-pass.dto'
import { CollectionEntity } from '../entities/collection.entity'

export class GetCollectionDto {
  id: string
  title: string
  description: string
  passes: GetPassDto[]
  blockchain: 'solana'

  constructor(collectionEntity: CollectionEntity) {
    this.id = collectionEntity.id
    this.title = collectionEntity.title
    this.description = collectionEntity.description
    this.passes =
      collectionEntity.passes.getItems().map((p) => new GetPassDto(p)) ?? []
    this.blockchain = collectionEntity.blockchain
  }
}
