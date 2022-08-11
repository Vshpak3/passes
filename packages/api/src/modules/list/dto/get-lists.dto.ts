import { ApiProperty } from '@nestjs/swagger'

import { GetListDto } from './get-list.dto'

export class GetListsDto {
  @ApiProperty()
  lists: GetListDto[]

  constructor(lists: GetListDto[]) {
    this.lists = lists
  }
}
