import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'

export class CircleUpdateCardDto {
  @IsUUID()
  @DtoProperty()
  keyId: string

  @DtoProperty()
  encryptedData: string

  @DtoProperty()
  expMonth: number

  @DtoProperty()
  expYear: number
}
