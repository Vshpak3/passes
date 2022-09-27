import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { BLOCKCHAIN_ADDRESS_LENGTH } from '../constants/schema'
import { ChainEnum } from '../enum/chain.enum'

export class AuthWalletResponseDto {
  @DtoProperty({ type: 'string' })
  rawMessage: string

  @Length(1, BLOCKCHAIN_ADDRESS_LENGTH)
  @DtoProperty({ type: 'string' })
  walletAddress: string

  @DtoProperty({ custom_type: ChainEnum })
  chain: ChainEnum
}
