import { DtoProperty } from '../../../web/endpoint.web'

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
