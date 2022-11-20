import { DtoProperty } from '../../../web/dto.web'
import { AdminDto } from './admin.dto'

export class UpdateAgencyMemberDto extends AdminDto {
  @DtoProperty({ type: 'uuid', optional: true })
  agencyId?: string

  @DtoProperty({ type: 'float' })
  rate: number
}
