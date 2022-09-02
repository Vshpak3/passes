import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class GetSolNftResponseDto {
  @IsUUID()
  @ApiProperty()
  id: string

  @ApiProperty()
  mintPublicKey: string

  @ApiProperty()
  metadataPublicKey: string

  @ApiProperty()
  signature: string

  constructor(id, mintPublicKey, metadataPublicKey, signature) {
    this.id = id
    this.mintPublicKey = mintPublicKey
    this.metadataPublicKey = metadataPublicKey
    this.signature = signature
  }
}
