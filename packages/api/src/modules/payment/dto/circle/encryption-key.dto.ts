import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../../web/dto.web'

export class CircleEncryptionKeyResponseDto {
  @IsUUID()
  @DtoProperty()
  keyId: string

  @DtoProperty()
  publicKey: string
}
