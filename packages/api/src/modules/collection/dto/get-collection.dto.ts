import { ApiProperty } from '@nestjs/swagger'

import { GetPassDto } from '../../pass/dto/get-pass.dto'
import { CollectionEntity } from '../entities/collection.entity'

export class GetCollectionDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  title: string

  @ApiProperty()
  description: string

  @ApiProperty()
  passes: GetPassDto[]

  @ApiProperty()
  blockchain: 'solana'

  constructor(collectionEntity: CollectionEntity) {
    this.id = collectionEntity.id
    this.title = collectionEntity.title
    this.description = collectionEntity.description
    this.blockchain = collectionEntity.blockchain
  }
}
