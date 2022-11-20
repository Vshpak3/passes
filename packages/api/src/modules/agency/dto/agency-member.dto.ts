import { IntersectionType, PickType } from '@nestjs/swagger'

import { DtoProperty } from '../../../web/dto.web'
import { UserDto } from '../../user/dto/user.dto'
import { AgencyEntity } from '../entities/agency.entity'
import { CreatorAgencyEntity } from '../entities/creator-agency.entity'
import { AgencyDto } from './agency.dto'

export class AgencyMemberDto extends IntersectionType(
  PickType(UserDto, ['userId', 'username', 'displayName'] as const),
  AgencyDto,
) {
  @DtoProperty({ type: 'float' })
  rate: number

  constructor(
    agencyMember: AgencyEntity &
      CreatorAgencyEntity & {
        user_id: string
        user_name: string
        display_name: string
      },
  ) {
    super()
    if (agencyMember) {
      this.userId = agencyMember.user_id

      this.username = agencyMember.user_name
      this.displayName = agencyMember.display_name
      this.agencyId = agencyMember.agency_id
      this.name = agencyMember.name
      this.rate = agencyMember.rate
    }
  }
}
