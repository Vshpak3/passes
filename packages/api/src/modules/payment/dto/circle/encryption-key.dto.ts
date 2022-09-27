import { DtoProperty } from '../../../../web/dto.web'

export class CircleEncryptionKeyResponseDto {
  @DtoProperty({ type: 'uuid' })
  keyId: string

  @DtoProperty({ type: 'string' })
  publicKey: string
}
