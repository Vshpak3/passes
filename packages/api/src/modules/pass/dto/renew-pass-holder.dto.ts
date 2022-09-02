import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { PayinMethodDto } from '../../payment/dto/payin-method.dto'

export class RenewPassHolderRequestDto {
  @IsUUID()
  @ApiProperty()
  passHolderId: string

  @ApiPropertyOptional()
  payinMethod?: PayinMethodDto
}
