import { ApiProperty } from '@nestjs/swagger'

export class CircleEncryptionKeyResponseDto {
  @ApiProperty()
  keyId: string

  @ApiProperty()
  publicKey: string
}
