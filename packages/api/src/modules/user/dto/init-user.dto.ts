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
  //TODO: add length validation
  @DtoProperty()
  accessToken: string

  public constructor(accessToken: string) {
    this.accessToken = accessToken
  }
}
