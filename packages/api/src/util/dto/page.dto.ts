import { IsUUID, Length } from 'class-validator'

import { DtoProperty } from '../../web/dto.web'

export const MAX_SEARCH_LENGTH = 300

export class PageRequestDto {
  @DtoProperty({ optional: true })
  createdAt?: Date

  @DtoProperty({ optional: true })
  updatedAt?: Date

  @IsUUID()
  @DtoProperty({ optional: true })
  lastId?: string

  @Length(1, MAX_SEARCH_LENGTH)
  @DtoProperty({ optional: true })
  search?: string

  @DtoProperty()
  order: 'desc' | 'asc'
}

export const orderToSymbol = {
  desc: '<',
  asc: '>',
}

export class PageResponseDto {
  @IsUUID()
  @DtoProperty()
  lastId: string

  @DtoProperty({ optional: true })
  createdAt?: Date

  @DtoProperty({ optional: true })
  updatedAt?: Date
}
