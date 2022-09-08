import { PickType } from '@nestjs/swagger'

import { DtoProperty } from '../../../web/dto.web'
import { CreateUserDto } from './create-user.dto'

export class SetInitialUserInfoRequestDto extends PickType(CreateUserDto, [
  'birthday',
  'countryCode',
  'legalFullName',
  'username',
]) {}

export class SetInitialUserInfoResponseDto {
  @DtoProperty()
  accessToken: string

  public constructor(accessToken: string) {
    this.accessToken = accessToken
  }
}
