import { DtoProperty } from '../../../web/endpoint.web'

export class AuthTokenResponseDto {
  @DtoProperty()
  accessToken: string

  @DtoProperty()
  refreshToken: string
}
