import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../../web/endpoint.web'

export class PayinEntryRequestDto {
  @IsUUID()
  @DtoProperty()
  payinId: string
}

export class PayinEntryResponseDto {
  @IsUUID()
  @DtoProperty()
  payinId: string
}
