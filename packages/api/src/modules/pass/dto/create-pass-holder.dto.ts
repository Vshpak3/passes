import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PayinMethodDto } from '../../payment/dto/payin-method.dto'

export class CreatePassHolderDto {
  @ApiProperty()
  passId: string

  @ApiProperty()
  temporary: boolean

  @ApiPropertyOptional()
  payinMethod?: PayinMethodDto
}
