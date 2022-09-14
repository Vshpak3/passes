import { DtoProperty } from '../../../web/dto.web'

export class AccessTokensResponseDto {
  @DtoProperty()
  accessToken: string

  @DtoProperty()
  refreshToken?: string

  public constructor(accessToken: string, refreshToken?: string) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
  }
}
