import { ApiProperty, PartialType } from '@nestjs/swagger'

import { ContentTypeEnum } from '../enums/content-type.enum'
import { VaultCategoryEnum } from '../enums/vault-category.enum'

class VaultQueryDto {
  @ApiProperty({ enum: VaultCategoryEnum })
  category: VaultCategoryEnum
  @ApiProperty({ enum: ContentTypeEnum })
  type: ContentTypeEnum
}

export class GetVaultQueryRequestDto extends PartialType(VaultQueryDto) {}
