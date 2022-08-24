import { IsEnum, Length } from 'class-validator'

import { ChainEnum } from '../../wallet/enum/chain.enum'

export class CreateCollectionDto {
  @Length(1, 100)
  title: string

  @Length(1, 400)
  description: string

  @IsEnum(ChainEnum)
  blockchain: ChainEnum
}
