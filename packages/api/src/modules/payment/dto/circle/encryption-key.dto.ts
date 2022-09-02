import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class CircleEncryptionKeyResponseDto {
  @IsUUID()
  @ApiProperty()
  keyId: string

  @ApiProperty()
  publicKey: string
}
