import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PayinMethodDto } from '../../payment/dto/payin-method.dto'

export class RenewPassHolderDto {
  @ApiProperty()
  passOwnershipId: string

  @ApiPropertyOptional()
  payinMethod?: PayinMethodDto
}
