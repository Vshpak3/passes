import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class CircleUpdateCardDto {
  @IsUUID()
  @ApiProperty()
  keyId: string

  @ApiProperty()
  encryptedData: string

  @ApiProperty()
  expMonth: number

  @ApiProperty()
  expYear: number
}
