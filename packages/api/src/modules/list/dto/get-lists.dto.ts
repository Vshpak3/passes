import { ApiProperty } from '@nestjs/swagger'

import { GetListResponseDto } from './get-list.dto'

export class GetListsResponseDto {
  @ApiProperty()
  lists: GetListResponseDto[]

  constructor(lists: GetListResponseDto[]) {
    this.lists = lists
  }
}
