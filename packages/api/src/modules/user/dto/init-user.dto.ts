import { PickType } from '@nestjs/swagger'

import { CreateUserRequestDto } from './create-user.dto'

export class SetInitialUserInfoRequestDto extends PickType(
  CreateUserRequestDto,
  ['birthday', 'countryCode', 'legalFullName', 'username'],
) {}
