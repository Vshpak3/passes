import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class ImpersonateUserRequestDto {
  @IsUUID()
  @DtoProperty({ required: false })
  userId?: string

  @DtoProperty({ required: false })
  username?: string

  @DtoProperty()
  secret: string
}

export class ImpersonateUserResponseDto {
  @DtoProperty()
  accessToken: string

  public constructor(accessToken: string) {
    this.accessToken = accessToken
  }
}
