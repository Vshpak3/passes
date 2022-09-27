import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import {
  PASS_DESCRIPTION_LENGTH,
  PASS_TITLE_LENGTH,
} from '../../pass/constants/schema'
import { ChainEnum } from '../../wallet/enum/chain.enum'
import { AdminDto } from './admin.dto'

export class CreateExternalPassRequestDto extends AdminDto {
  @Length(1, PASS_TITLE_LENGTH)
  @DtoProperty({ type: 'string' })
  title: string

  @Length(1, PASS_DESCRIPTION_LENGTH)
  @DtoProperty({ type: 'string' })
  description: string

  @DtoProperty({ custom_type: ChainEnum })
  chain: ChainEnum
}
