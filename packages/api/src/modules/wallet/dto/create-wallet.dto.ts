import { IsEnum, Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { BLOCKCHAIN_ADDRESS_LENGTH } from '../constants/schema'
import { ChainEnum } from '../enum/chain.enum'

export class CreateWalletRequestDto {
  //TODO: add length validation - patrick
  @DtoProperty()
  signedMessage: string

  @DtoProperty()
  rawMessage: string

  @Length(1, BLOCKCHAIN_ADDRESS_LENGTH)
  @DtoProperty()
  walletAddress: string

  @IsEnum(ChainEnum)
  @DtoProperty({ enum: ChainEnum })
  chain: ChainEnum
}

export class CreateUnauthenticatedWalletRequestDto {
  @Length(1, BLOCKCHAIN_ADDRESS_LENGTH)
  @DtoProperty()
  walletAddress: string

  @IsEnum(ChainEnum)
  @DtoProperty({ enum: ChainEnum })
  chain: ChainEnum
}
