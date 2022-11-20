import { DtoProperty } from '../../../web/dto.web'
import { AdminDto } from './admin.dto'

export class UpdateAgencyMemberDto extends AdminDto {
  @DtoProperty({ type: 'uuid' })
  agencyId: string

  @DtoProperty({ type: 'uuid' })
  creatorId: string

  @DtoProperty({ type: 'float' })
  rate: number
}
