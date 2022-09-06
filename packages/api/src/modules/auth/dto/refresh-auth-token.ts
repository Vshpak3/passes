import { IsString } from 'class-validator'

import { DtoProperty } from '../../../web/endpoint.web'

export class RefreshAuthTokenRequestDto {
  @IsString()
  @DtoProperty()
  refreshToken: string
}
