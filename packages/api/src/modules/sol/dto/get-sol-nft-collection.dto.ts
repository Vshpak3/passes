import { ApiProperty } from '@nestjs/swagger'

export class GetSolNftCollectionDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  collectionPublicKey: string

  @ApiProperty()
  signature: string

  constructor(id, pubKey, signature) {
    this.id = id
    this.collectionPublicKey = pubKey
    this.signature = signature
  }
}
