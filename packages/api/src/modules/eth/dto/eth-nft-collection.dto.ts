import { DtoProperty } from '../../../web/dto.web'

export class EthNftCollectionDto {
  @DtoProperty()
  tokenAddress: string

  @DtoProperty()
  name: string

  constructor(ethNftCollection) {
    this.tokenAddress = ethNftCollection.token_address
    this.name = ethNftCollection.name
  }
}
