import { ApiProperty } from '@nestjs/swagger'

export class GetSolNftDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  mintPublicKey: string

  @ApiProperty()
  mintSecretKey: string

  @ApiProperty()
  metadataPublicKey: string

  @ApiProperty()
  metadataSecretKey: string

  @ApiProperty()
  signature: string

  constructor(id, mintPublicKey, mintSecretKey, metadataPublicKey, signature) {
    this.id = id
    this.mintPublicKey = mintPublicKey
    this.mintSecretKey = mintSecretKey
    this.metadataPublicKey = metadataPublicKey
    this.signature = signature
  }
}
