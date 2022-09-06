import { DtoProperty } from '../../../web/dto.web'

export class AuthTokenResponseDto {
  @DtoProperty()
  accessToken: string

  @DtoProperty()
  refreshToken: string
}
