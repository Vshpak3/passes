import { PickType } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

import { PageRequestDto, PageResponseDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'
import { ContentTypeEnum } from '../enums/content-type.enum'
import { VaultCategoryEnum } from '../enums/vault-category.enum'
import { ContentDto } from './content.dto'

export class GetVaultQueryRequestDto extends PickType(PageRequestDto, [
  'lastId',
  'createdAt',
]) {
  @IsEnum(VaultCategoryEnum)
  @DtoProperty({ enum: VaultCategoryEnum, optional: true })
  category?: VaultCategoryEnum

  @IsEnum(ContentTypeEnum)
  @DtoProperty({ enum: ContentTypeEnum, optional: true })
  type?: ContentTypeEnum
}

export class GetVaultQueryResponseDto extends PageResponseDto {
  @DtoProperty({ type: [ContentDto] })
  contents: ContentDto[]

  constructor(contents: ContentDto[]) {
    super()
    this.contents = contents
    if (contents.length > 0) {
      this.lastId = contents[contents.length - 1].contentId
      this.createdAt = contents[contents.length - 1].createdAt
    }
  }
}
