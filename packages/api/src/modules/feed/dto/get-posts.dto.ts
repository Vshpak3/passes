import { PickType } from '@nestjs/swagger'

import { PageRequestDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'

export class GetPostsRequestDto extends PickType(PageRequestDto, [
  'lastId',
  'createdAt',
]) {
  @DtoProperty({ type: 'boolean' })
  scheduledOnly?: boolean
}
