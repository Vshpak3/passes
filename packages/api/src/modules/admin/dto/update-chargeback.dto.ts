import { DtoProperty } from '../../../web/dto.web'
import { AdminDto } from './admin.dto'

export class UpdateChargebackRequestDto extends AdminDto {
  @DtoProperty({ type: 'uuid' })
  circleChargebackId: string

  @DtoProperty({ type: 'boolean' })
  disputed: boolean
}
