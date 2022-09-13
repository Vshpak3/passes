import { DtoProperty } from '../../../web/dto.web'

export class AuthTokenResponseDto {
  //TODO: add length verification for both
  @DtoProperty()
  accessToken: string

  @DtoProperty()
  refreshToken: string
}
