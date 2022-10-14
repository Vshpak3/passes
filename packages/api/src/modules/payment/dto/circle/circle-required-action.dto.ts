import { DtoProperty } from '../../../../web/dto.web'

export class CircleRequiredActionDto {
  @DtoProperty({ type: 'string' })
  type: string

  @DtoProperty({ type: 'string' })
  redirectUrl: string
}
