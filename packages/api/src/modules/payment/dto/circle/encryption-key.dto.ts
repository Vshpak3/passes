import { ApiProperty } from '@nestjs/swagger'

export class EncryptionKeyDto {
  @ApiProperty()
  keyId: string

  @ApiProperty()
  publicKey: string

  constructor(keyId: string, publicKey: string) {
    ;(this.keyId = keyId), (this.publicKey = publicKey)
  }
}
