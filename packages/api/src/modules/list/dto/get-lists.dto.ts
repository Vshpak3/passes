import { ApiProperty } from '@nestjs/swagger'

import { ListDto } from './list.dto'

export class GetListsResponseDto {
  @ApiProperty()
  lists: ListDto[]

  constructor(lists: ListDto[]) {
    this.lists = lists
  }
}
