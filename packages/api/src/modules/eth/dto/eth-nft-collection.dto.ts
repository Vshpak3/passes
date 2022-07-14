import { ApiProperty } from '@nestjs/swagger'

import { EthNftCollectionEntity } from '../entities/eth-nft-collection.entity'

export class EthNftCollectionDto {
  @ApiProperty()
  tokenAddress: string

  @ApiProperty()
  name: string

  constructor(ethNftCollectionEntity: EthNftCollectionEntity) {
    this.tokenAddress = ethNftCollectionEntity.tokenAddress
    this.name = ethNftCollectionEntity.name
  }
}
