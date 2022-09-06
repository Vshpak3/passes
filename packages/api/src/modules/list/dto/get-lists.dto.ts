import { DtoProperty } from '../../../web/dto.web'
import { ListDto } from './list.dto'

export class GetListsResponseDto {
  @DtoProperty()
  lists: ListDto[]

  constructor(lists: ListDto[]) {
    this.lists = lists
  }
}
