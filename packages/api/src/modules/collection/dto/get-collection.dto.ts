import { ApiProperty } from '@nestjs/swagger'

import { GetPassDto } from '../../pass/dto/get-pass.dto'

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

  constructor(collectionEntity) {
    this.id = collectionEntity.id
    this.title = collectionEntity.title
    this.description = collectionEntity.description
    this.blockchain = collectionEntity.blockchain
  }
}
