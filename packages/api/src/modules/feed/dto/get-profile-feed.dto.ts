import { PickType } from '@nestjs/swagger'

import { PageRequestDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'

export class GetProfileFeedRequestDto extends PickType(PageRequestDto, [
  'lastId',
  'createdAt',
  'pinned',
]) {
  @DtoProperty({ type: 'uuid' })
  creatorId: string
}
