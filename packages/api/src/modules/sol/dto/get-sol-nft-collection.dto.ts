import { ApiProperty } from '@nestjs/swagger'

export class GetSolNftCollectionDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  collectionPublicKey: string

  @ApiProperty()
  collectionSecretKey: string

  @ApiProperty()
  signature: string

  constructor(id, pubKey, secretKey, signature) {
    this.id = id
    this.collectionPublicKey = pubKey
    this.collectionSecretKey = secretKey
    this.signature = signature
  }
}
