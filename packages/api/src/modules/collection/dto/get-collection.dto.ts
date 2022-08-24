import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

import { GetPassDto } from '../../pass/dto/get-pass.dto'
import { ChainEnum } from '../../wallet/enum/chain.enum'

export class GetCollectionDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  title: string

  @ApiProperty()
  description: string

  @ApiProperty({ type: [GetPassDto] })
  passes: GetPassDto[]

  @IsEnum(ChainEnum)
  blockchain: ChainEnum

  constructor(collectionEntity) {
    this.id = collectionEntity.id
    this.title = collectionEntity.title
    this.description = collectionEntity.description
    this.blockchain = collectionEntity.blockchain
  }
}
