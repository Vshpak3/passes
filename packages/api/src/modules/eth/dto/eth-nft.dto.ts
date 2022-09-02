import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { EthNftEntity } from '../entities/eth-nft.entity'
import { EthNftCollectionEntity } from '../entities/eth-nft-collection.entity'
import { EthNftCollectionDto } from './eth-nft-collection.dto'

export class EthNftDto {
  @IsUUID()
  @ApiProperty()
  tokenId: string

  @ApiProperty()
  tokenHash?: string

  @ApiProperty()
  ethNftCollection: EthNftCollectionDto

  constructor(
    ethNftEntity: EthNftEntity,
    ethNftCollectionEntity: EthNftCollectionEntity,
  ) {
    this.tokenId = ethNftEntity.tokenId
    this.tokenHash = ethNftEntity.tokenHash
    this.ethNftCollection = new EthNftCollectionDto(ethNftCollectionEntity)
  }
}
