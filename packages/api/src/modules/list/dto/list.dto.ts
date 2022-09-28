import { Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { LIST_NAME_LENGTH } from '../constants/schema'
import { ListEntity } from '../entities/list.entity'
import { ListTypeEnum } from '../enum/list.type.enum'

export class ListDto {
  @DtoProperty({ type: 'uuid' })
  listId: string

  @Length(1, LIST_NAME_LENGTH)
  @DtoProperty({ type: 'string' })
  name: string

  @DtoProperty({ custom_type: ListTypeEnum })
  type: ListTypeEnum

  @Min(0)
  @DtoProperty({ type: 'number' })
  count: number

  @DtoProperty({ type: 'date' })
  createdAt: Date

  @DtoProperty({ type: 'date' })
  updatedAt: Date

  constructor(list: ListEntity | undefined) {
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
