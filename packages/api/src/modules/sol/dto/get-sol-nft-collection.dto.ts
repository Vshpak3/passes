import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class GetSolNftCollectionResponseDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @DtoProperty()
  collectionPublicKey: string

  @DtoProperty()
  signature: string

  constructor(id, pubKey, signature) {
    this.id = id
    this.collectionPublicKey = pubKey
    this.signature = signature
  }
}
