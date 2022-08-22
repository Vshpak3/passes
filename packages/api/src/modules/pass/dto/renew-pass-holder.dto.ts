import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PayinMethodDto } from '../../payment/dto/payin-method.dto'

export class RenewPassHolderDto {
  @ApiProperty()
  passHolderId: string

  @ApiPropertyOptional()
  payinMethod?: PayinMethodDto
}
