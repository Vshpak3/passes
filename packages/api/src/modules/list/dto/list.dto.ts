import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/endpoint.web'
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

  @DtoProperty({ required: false })
  passId?: string

  @DtoProperty({ required: false })
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
