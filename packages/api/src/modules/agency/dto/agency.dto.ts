import { DtoProperty } from '../../../web/dto.web'

export class AgencyDto {
  @DtoProperty({ type: 'uuid' })
  agencyId: string

  @DtoProperty({ type: 'string' })
  name: string
}
