import { PickType } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'
import { LocalUserDto } from './local-user.dto'

export class ConfirmResetPasswordRequestDto extends PickType(LocalUserDto, [
  'password',
]) {
  @IsUUID()
  @DtoProperty()
  verificationToken: string
}
