import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class GetSolNftCollectionResponseDto {
  @IsUUID()
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
