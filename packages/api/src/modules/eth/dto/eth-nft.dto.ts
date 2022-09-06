import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/endpoint.web'
import { EthNftEntity } from '../entities/eth-nft.entity'
import { EthNftCollectionEntity } from '../entities/eth-nft-collection.entity'
import { EthNftCollectionDto } from './eth-nft-collection.dto'

export class EthNftDto {
  @IsUUID()
  @DtoProperty()
  tokenId: string

  @DtoProperty({ required: false })
  tokenHash?: string

  @DtoProperty()
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
