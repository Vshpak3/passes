import { Length } from 'class-validator'

import { DtoProperty } from '../../web/dto.web'

export const MAX_SEARCH_LENGTH = 300

export enum OrderEnum {
  ASC = 'asc',
  DESC = 'desc',
}

export class PageRequestDto {
  @DtoProperty({ type: 'date', optional: true })
  createdAt?: Date

  @DtoProperty({ type: 'date', optional: true })
  updatedAt?: Date

  @DtoProperty({ type: 'uuid', optional: true })
  lastId?: string

  @Length(0, MAX_SEARCH_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  search?: string

  @DtoProperty({ custom_type: OrderEnum })
  order: OrderEnum

  @DtoProperty({ type: 'boolean', optional: true })
  pinned?: boolean
}

export interface PageResponseDto<DataDto> {
  data: DataDto[]
}
