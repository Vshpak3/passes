import { ApiProperty } from '@nestjs/swagger'

export class EthNftCollectionDto {
  @ApiProperty()
  tokenAddress: string

  @ApiProperty()
  name: string

  constructor(ethNftCollection) {
    this.tokenAddress = ethNftCollection.token_address
    this.name = ethNftCollection.name
  }
}
