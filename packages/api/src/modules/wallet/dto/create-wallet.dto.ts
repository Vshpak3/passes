import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { BLOCKCHAIN_ADDRESS_LENGTH } from '../constants/schema'
import { ChainEnum } from '../enum/chain.enum'

export class CreateWalletRequestDto {
  @DtoProperty({ type: 'string' })
  signedMessage: string

  @DtoProperty({ type: 'string' })
  rawMessage: string

  @Length(1, BLOCKCHAIN_ADDRESS_LENGTH)
  @DtoProperty({ type: 'string' })
  walletAddress: string

  @DtoProperty({ custom_type: ChainEnum })
  chain: ChainEnum
}

export class CreateUnauthenticatedWalletRequestDto {
  @Length(1, BLOCKCHAIN_ADDRESS_LENGTH)
  @DtoProperty({ type: 'string' })
  walletAddress: string

  @DtoProperty({ custom_type: ChainEnum })
  chain: ChainEnum
}

export class CreateWalletResponseDto {
  @DtoProperty({ type: 'uuid' })
  id: string | null

  constructor(id: string | null) {
    this.id = id
  }
}
