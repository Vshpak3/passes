import { IsEnum, IsInt, IsUUID, Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { LIST_NAME_LENGTH } from '../constants/schema'
import { ListTypeEnum } from '../enum/list.type.enum'

export class ListDto {
  @IsUUID()
  @DtoProperty()
  listId: string

  @Length(1, LIST_NAME_LENGTH)
  @DtoProperty()
  name: string

  @IsEnum(ListTypeEnum)
  @DtoProperty({ enum: ListTypeEnum })
  type: ListTypeEnum

  @IsInt()
  @Min(0)
  @DtoProperty()
  count: number

  @DtoProperty()
  createdAt: Date

  @DtoProperty()
  updatedAt: Date

  constructor(list) {
    if (list) {
      this.listId = list.id
      this.name = list.name
      this.type = list.type
      this.count = list.count
      this.createdAt = list.created_at
      this.updatedAt = list.updated_at
    }
  }
}
