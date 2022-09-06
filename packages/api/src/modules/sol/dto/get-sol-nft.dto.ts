import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class GetSolNftResponseDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @DtoProperty()
  mintPublicKey: string

  @DtoProperty()
  metadataPublicKey: string

  @DtoProperty()
  signature: string

  constructor(id, mintPublicKey, metadataPublicKey, signature) {
    this.id = id
    this.mintPublicKey = mintPublicKey
    this.metadataPublicKey = metadataPublicKey
    this.signature = signature
  }
}
