import { IsEnum, Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import {
  PASS_DESCRIPTION_LENGTH,
  PASS_TITLE_LENGTH,
} from '../../pass/constants/schema'
import { ChainEnum } from '../../wallet/enum/chain.enum'
import { AdminDto } from './admin.dto'

export class CreateExternalPassRequestDto extends AdminDto {
  @Length(1, PASS_TITLE_LENGTH)
  @DtoProperty()
  title: string

  @Length(1, PASS_DESCRIPTION_LENGTH)
  @DtoProperty()
  description: string

  @IsEnum(ChainEnum)
  @DtoProperty({ enum: ChainEnum })
  chain: ChainEnum
}
