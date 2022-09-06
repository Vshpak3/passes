import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

// this is a debug endpoint used for testing
export class CreateSolNftRequestDto {
  @IsUUID()
  @DtoProperty()
  collectionId: string

  @IsUUID()
  @DtoProperty()
  walletId: string
}
