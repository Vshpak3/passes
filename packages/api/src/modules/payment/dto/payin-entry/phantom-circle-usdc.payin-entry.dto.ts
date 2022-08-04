import { ApiProperty } from '@nestjs/swagger'

import { PayinEntryInputDto, PayinEntryOutputDto } from './payin-entry.dto'

export class PhantomCircleUSDCEntryInputDto extends PayinEntryInputDto {
  @ApiProperty()
  ownerAccount: string
}

export class PhantomCircleUSDCEntryOutputDto extends PayinEntryOutputDto {
  @ApiProperty()
  message: Uint8Array
}
