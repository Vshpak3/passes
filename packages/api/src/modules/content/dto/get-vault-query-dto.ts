import { PickType } from '@nestjs/swagger'

import { PageRequestDto, PageResponseDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'
import { ContentTypeEnum } from '../enums/content-type.enum'
import { VaultCategoryEnum } from '../enums/vault-category.enum'
import { ContentDto } from './content.dto'

export class GetVaultQueryRequestDto extends PickType(PageRequestDto, [
  'lastId',
  'createdAt',
]) {
  @DtoProperty({ custom_type: VaultCategoryEnum, optional: true })
  category?: VaultCategoryEnum

  @DtoProperty({ custom_type: ContentTypeEnum, optional: true })
  type?: ContentTypeEnum
}

export class GetVaultQueryResponseDto
  extends GetVaultQueryRequestDto
  implements PageResponseDto<ContentDto>
{
  @DtoProperty({ custom_type: [ContentDto] })
  data: ContentDto[]

  constructor(contents: ContentDto[], requestDto: GetVaultQueryRequestDto) {
    super()
    for (const key in requestDto) {
      this[key] = requestDto[key]
    }
    this.lastId = undefined
    this.data = contents
    if (contents.length > 0) {
      this.lastId = contents[contents.length - 1].contentId
      this.createdAt = contents[contents.length - 1].createdAt
    }
  }
}
