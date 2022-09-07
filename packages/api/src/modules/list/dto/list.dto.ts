import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { ListTypeEnum } from '../enum/list.type.enum'

export class ListDto {
  @IsUUID()
  @DtoProperty()
  listId: string

  @DtoProperty()
  name: string

  @DtoProperty({ enum: ListTypeEnum })
  type: ListTypeEnum

  @DtoProperty()
  count: number

  constructor(list) {
    if (list) {
      this.listId = list.id
      this.name = list.name
      this.type = list.type
      this.count = list.count
    }
  }
}
