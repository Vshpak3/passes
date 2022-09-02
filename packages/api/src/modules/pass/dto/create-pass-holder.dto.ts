import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { PayinMethodDto } from '../../payment/dto/payin-method.dto'

export class CreatePassHolderRequestDto {
  @IsUUID()
  @ApiProperty()
  passId: string

  @ApiPropertyOptional()
  payinMethod?: PayinMethodDto
}
