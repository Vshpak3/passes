import { DtoProperty } from '../../../web/dto.web'
import { PassMediaEnum } from '../../pass/enum/pass-media.enum'

export class PresignPassRequestDto {
  @DtoProperty({ type: 'uuid' })
  passId: string

  @DtoProperty({ custom_type: PassMediaEnum })
  type: PassMediaEnum
}
