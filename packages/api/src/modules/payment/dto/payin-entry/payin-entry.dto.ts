import { ApiProperty } from '@nestjs/swagger'

export class PayinEntryRequestDto {
  @ApiProperty()
  payinId: string
}

export class PayinEntryResponseDto {
  @ApiProperty()
  payinId: string
}
