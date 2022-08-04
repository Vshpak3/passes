import { ApiProperty } from '@nestjs/swagger'

import { PayinEntryInputDto, PayinEntryOutputDto } from './payin-entry.dto'

export class MetamaskCircleUSDCEntryInputDto extends PayinEntryInputDto {}

export class MetamaskCircleUSDCEntryOutputDto extends PayinEntryOutputDto {
  @ApiProperty()
  address: string

  @ApiProperty()
  chain: number
}
