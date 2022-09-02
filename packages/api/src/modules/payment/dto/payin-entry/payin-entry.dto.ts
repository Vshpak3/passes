import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class PayinEntryRequestDto {
  @IsUUID()
  @ApiProperty()
  payinId: string
}

export class PayinEntryResponseDto {
  @IsUUID()
  @ApiProperty()
  payinId: string
}
