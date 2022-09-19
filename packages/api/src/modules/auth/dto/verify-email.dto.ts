import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class VerifyEmailDto {
  @IsUUID()
  @DtoProperty()
  verificationToken: string
}
