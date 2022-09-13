import { PartialType } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { ContentTypeEnum } from '../enums/content-type.enum'
import { VaultCategoryEnum } from '../enums/vault-category.enum'

class VaultQueryDto {
  @IsEnum(VaultCategoryEnum)
  @DtoProperty({ enum: VaultCategoryEnum })
  category: VaultCategoryEnum

  @IsEnum(ContentTypeEnum)
  @DtoProperty({ enum: ContentTypeEnum })
  type: ContentTypeEnum
}

export class GetVaultQueryRequestDto extends PartialType(VaultQueryDto) {}
