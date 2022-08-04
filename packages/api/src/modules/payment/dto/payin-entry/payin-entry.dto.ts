import { ApiProperty } from '@nestjs/swagger'

export class PayinEntryInputDto {
  @ApiProperty()
  paymentId: string
}

export class PayinEntryOutputDto {
  @ApiProperty()
  paymentId: string
}
