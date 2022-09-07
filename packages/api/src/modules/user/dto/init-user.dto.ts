import { PickType } from '@nestjs/swagger'

import { DtoProperty } from '../../../web/dto.web'
import { CreateUserRequestDto } from './create-user.dto'

export class SetInitialUserInfoRequestDto extends PickType(
  CreateUserRequestDto,
  ['birthday', 'countryCode', 'legalFullName', 'username'],
) {}

export class SetInitialUserInfoResponseDto {
  @DtoProperty()
  accessToken: string

  public constructor(accessToken: string) {
    this.accessToken = accessToken
  }
}
