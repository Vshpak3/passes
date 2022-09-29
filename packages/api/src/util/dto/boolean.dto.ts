import { DtoProperty } from '../../web/dto.web'

export class BooleanResponseDto {
  @DtoProperty({ type: 'boolean' })
  value: boolean

  constructor(value: boolean) {
    this.value = value
  }
}
