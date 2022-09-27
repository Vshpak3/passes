import { DtoProperty } from '../../../web/dto.web'

export class AccessTokensResponseDto {
  @DtoProperty({ type: 'string' })
  accessToken: string

  @DtoProperty({ type: 'string' })
  refreshToken?: string

  public constructor(accessToken: string, refreshToken?: string) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
  }
}
