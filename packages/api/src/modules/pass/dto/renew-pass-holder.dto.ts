import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PayinMethodDto } from '../../payment/dto/payin-method.dto'

export class RenewPassHolderRequestDto {
  @ApiProperty()
  passHolderId: string

  @ApiPropertyOptional()
  payinMethod?: PayinMethodDto
}
