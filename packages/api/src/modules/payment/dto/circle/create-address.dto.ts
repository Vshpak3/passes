import { ApiProperty } from '@nestjs/swagger'

export class CircleCreateAddressDto {
  @ApiProperty()
  idempotencyKey: string

  @ApiProperty()
  currency: string

  @ApiProperty()
  chain: string
}
