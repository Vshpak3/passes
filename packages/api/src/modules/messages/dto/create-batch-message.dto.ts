import { PickType } from '@nestjs/swagger'

import { DtoProperty } from '../../../web/dto.web'
import { SendMessageRequestDto } from './send-message.dto'

export class CreateBatchMessageRequestDto extends PickType(
  SendMessageRequestDto,
  ['price', 'contentIds', 'text', 'previewIndex'],
) {
  @DtoProperty({ type: 'uuid[]' })
  includeListIds: string[]

  @DtoProperty({ type: 'uuid[]' })
  excludeListIds: string[]

  @DtoProperty({ type: 'uuid[]' })
  passIds: string[]
}
