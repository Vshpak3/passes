import { PickType } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { SendMessageRequestDto } from './send-message.dto'

export class CreateBatchMessageRequestDto extends PickType(
  SendMessageRequestDto,
  ['price', 'contentIds', 'text'],
) {
  @IsUUID('all', { each: true })
  @DtoProperty()
  includeListIds: string[]

  @IsUUID('all', { each: true })
  @DtoProperty()
  exlcudeListIds: string[]

  @IsUUID('all', { each: true })
  @DtoProperty()
  passIds: string[]
}
