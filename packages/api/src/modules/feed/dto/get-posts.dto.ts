import { PickType } from '@nestjs/swagger'

import { PageRequestDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'

export class GetPostsRequesteDto extends PickType(PageRequestDto, [
  'lastId',
  'createdAt',
]) {
  @DtoProperty()
  scheduledOnly?: boolean
}
