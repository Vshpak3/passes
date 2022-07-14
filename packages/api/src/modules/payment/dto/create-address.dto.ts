import { ApiProperty } from '@nestjs/swagger'

export class CreateAddressDto {
  @ApiProperty()
  idempotencyKey: string
  @ApiProperty()
  currency = 'USD'
  @ApiProperty()
  chain = 'SOL'
}
