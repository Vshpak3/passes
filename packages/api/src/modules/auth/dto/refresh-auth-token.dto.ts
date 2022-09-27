import { IsString } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class RefreshAuthTokenRequestDto {
  @IsString()
  @DtoProperty({ type: 'string' })
  refreshToken: string
}
