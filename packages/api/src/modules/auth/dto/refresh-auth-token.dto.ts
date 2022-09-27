import { DtoProperty } from '../../../web/dto.web'

export class RefreshAuthTokenRequestDto {
  @DtoProperty({ type: 'string' })
  refreshToken: string
}
