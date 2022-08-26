import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PayinMethodDto } from '../../payment/dto/payin-method.dto'

export class CreatePassHolderRequestDto {
  @ApiProperty()
  passId: string

  @ApiPropertyOptional()
  payinMethod?: PayinMethodDto
}
