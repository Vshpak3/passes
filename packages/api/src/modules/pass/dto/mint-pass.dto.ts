import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class MintPassRequestDto {
  @IsUUID()
  @DtoProperty()
  passId: string
}

export class MintPassResponseDto {
  @DtoProperty()
  minted: boolean

  constructor(minted: boolean) {
    this.minted = minted
  }
}
