import { ApiProperty } from '@nestjs/swagger'

export class CircleUpdateCardDto {
  @ApiProperty()
  keyId: string

  @ApiProperty()
  encryptedData: string

  @ApiProperty()
  expMonth: number

  @ApiProperty()
  expYear: number
}
