import { ApiProperty } from '@nestjs/swagger'

export class CircleCreateAddressRequestDto {
  @ApiProperty()
  idempotencyKey: string

  @ApiProperty()
  currency: string

  @ApiProperty()
  chain: string
}
