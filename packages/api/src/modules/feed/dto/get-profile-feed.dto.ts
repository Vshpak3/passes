import { PickType } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { PageRequestDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'

export class GetProfileFeedRequestDto extends PickType(PageRequestDto, [
  'lastId',
  'createdAt',
]) {
  @IsUUID()
  @DtoProperty()
  creatorId: string
}
