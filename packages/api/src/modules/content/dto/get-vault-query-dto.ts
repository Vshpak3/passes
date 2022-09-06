import { PartialType } from '@nestjs/swagger'

import { DtoProperty } from '../../../web/dto.web'
import { ContentTypeEnum } from '../enums/content-type.enum'
import { VaultCategoryEnum } from '../enums/vault-category.enum'

class VaultQueryDto {
  @DtoProperty({ enum: VaultCategoryEnum })
  category: VaultCategoryEnum

  @DtoProperty({ enum: ContentTypeEnum })
  type: ContentTypeEnum
}

export class GetVaultQueryRequestDto extends PartialType(VaultQueryDto) {}
