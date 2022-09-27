import { DtoProperty } from '../../../../web/dto.web'

export class CircleStatusResponseDto {
  @DtoProperty({ type: 'uuid' })
  id: string

  @DtoProperty({ type: 'uuid' })
  circleId: string

  @DtoProperty({ type: 'string' })
  status: string
}
