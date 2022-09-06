import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../../web/endpoint.web'

export class CircleEncryptionKeyResponseDto {
  @IsUUID()
  @DtoProperty()
  keyId: string

  @DtoProperty()
  publicKey: string
}
