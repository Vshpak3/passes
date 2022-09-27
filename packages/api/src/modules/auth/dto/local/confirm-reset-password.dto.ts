import { PickType } from '@nestjs/swagger'

import { DtoProperty } from '../../../../web/dto.web'
import { LocalUserDto } from './local-user.dto'

export class ConfirmResetPasswordRequestDto extends PickType(LocalUserDto, [
  'password',
]) {
  @DtoProperty({ type: 'uuid' })
  verificationToken: string
}
