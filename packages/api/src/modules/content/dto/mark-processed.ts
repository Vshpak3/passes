import { OmitType, PickType } from '@nestjs/swagger'
import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { LAMBDA_SECRET_LENGTH } from '../constants/schema'
import { PROFILE_CONTENT_TYPES } from '../helpers/content-paths'
import { ContentDto } from './content.dto'

class MarkProcessedDto extends PickType(ContentDto, [
  'contentId',
  'userId',
] as const) {
  @Length(1, LAMBDA_SECRET_LENGTH)
  @DtoProperty({ type: 'string' })
  secret: string
}

export class MarkProcessedUserContentRequestDto extends MarkProcessedDto {}

export class MarkProcessedProfileImageRequestDto extends OmitType(
  MarkProcessedDto,
  ['contentId'],
) {
  @DtoProperty({ type: 'string', optional: true })
  type?: PROFILE_CONTENT_TYPES
}
