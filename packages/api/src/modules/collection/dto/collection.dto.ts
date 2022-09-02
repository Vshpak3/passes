import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsUUID } from 'class-validator'

import { PassDto } from '../../pass/dto/pass.dto'
import { ChainEnum } from '../../wallet/enum/chain.enum'

export class CollectionDto {
  @IsUUID()
  @ApiProperty()
  id: string

  @ApiProperty()
  title: string

  @ApiProperty()
  description: string

  @ApiProperty({ type: [PassDto] })
  passes: PassDto[]

  @IsEnum(ChainEnum)
  blockchain: ChainEnum

  constructor(collection) {
    this.id = collection.id
    this.title = collection.title
    this.description = collection.description
    this.blockchain = collection.blockchain
  }
}
