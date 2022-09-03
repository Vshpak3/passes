import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { ListTypeEnum } from '../enum/list.type.enum'

export class ListDto {
  @IsUUID()
  @ApiProperty()
  listId: string

  @ApiProperty()
  name: string

  @ApiProperty({ enum: ListTypeEnum })
  type: ListTypeEnum

  @ApiProperty()
  count: string

  @ApiPropertyOptional()
  passId?: string

  @ApiPropertyOptional()
  passTitle?: string

  constructor(list) {
    if (list) {
      this.listId = list.id
      this.name = list.name
      this.type = list.type
      this.count = list.count

      this.passId = list.pass_id
      this.passId = list.pass_title
    }
  }
}
