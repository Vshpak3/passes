import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'

export class CircleStatusResponseDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @IsUUID()
  @DtoProperty()
  circleId: string

  @DtoProperty()
  status: string
}
