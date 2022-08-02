import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { ProviderAccountTypeEnum, ProviderEnum } from '../enum/provider.enum'

export class DefaultProviderDto {
  @ApiProperty({ enum: ProviderEnum })
  provider: ProviderEnum
  @ApiProperty({ enum: ProviderAccountTypeEnum })
  providerAccountType: ProviderAccountTypeEnum
  @ApiPropertyOptional()
  providerAccountId?: string
}
