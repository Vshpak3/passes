import { DtoProperty } from '../../../web/dto.web'

export class MintPassRequestDto {
  @DtoProperty({ type: 'uuid' })
  passId: string
}

export class MintPassResponseDto {
  @DtoProperty({ type: 'boolean' })
  minted: boolean

  constructor(minted: boolean) {
    this.minted = minted
  }
}
