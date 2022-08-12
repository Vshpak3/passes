import { ApiProperty } from '@nestjs/swagger'

export class CircleEncryptionKeyDto {
  @ApiProperty()
  keyId: string

  @ApiProperty()
  publicKey: string
}
