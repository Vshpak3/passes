import { ApiProperty, PartialType } from '@nestjs/swagger'

import { ContentType, VaultCategory } from '../constants/validation'

class VaultQueryDto {
  @ApiProperty({ enum: VaultCategory })
  category: VaultCategory
  @ApiProperty({ enum: ContentType })
  type: ContentType
}

export class GetVaultQueryRequestDto extends PartialType(VaultQueryDto) {}
