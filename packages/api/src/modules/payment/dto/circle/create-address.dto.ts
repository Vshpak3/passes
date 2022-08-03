import { ApiProperty } from '@nestjs/swagger'

export class CreateAddressDto {
  @ApiProperty()
  idempotencyKey: string
  @ApiProperty()
  currency: string
  @ApiProperty()
  chain: string
}
