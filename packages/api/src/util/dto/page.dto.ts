import { Length } from 'class-validator'

import { DtoProperty } from '../../web/dto.web'

export const MAX_SEARCH_LENGTH = 300

export class PageRequestDto {
  @DtoProperty({ type: 'date', optional: true })
  createdAt?: Date

  @DtoProperty({ type: 'date', optional: true })
  updatedAt?: Date

  @DtoProperty({ type: 'uuid', optional: true })
  lastId?: string

  @Length(1, MAX_SEARCH_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  search?: string

  @DtoProperty({ type: 'string' })
  order: 'desc' | 'asc'
}

export const orderToSymbol = {
  desc: '<=',
  asc: '>=',
}

export class PageResponseDto {
  @DtoProperty({ type: 'uuid' })
  lastId: string

  @DtoProperty({ type: 'date', optional: true })
  createdAt?: Date

  @DtoProperty({ type: 'date', optional: true })
  updatedAt?: Date
}
