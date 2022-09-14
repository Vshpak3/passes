import { IsEmail } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class SetEmailRequestDto {
  @IsEmail()
  @DtoProperty({ forceLower: true })
  email: string
}

export class SetEmailResponseDto {
  @DtoProperty()
  accessToken: string

  public constructor(accessToken: string) {
    this.accessToken = accessToken
  }
}
