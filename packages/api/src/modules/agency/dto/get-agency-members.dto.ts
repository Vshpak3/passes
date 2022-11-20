import { DtoProperty } from '../../../web/dto.web'
import { AgencyMemberDto } from './agency-member.dto'

export class GetAgencyMembersResponseDto {
  @DtoProperty({ custom_type: [AgencyMemberDto] })
  data: AgencyMemberDto[]

  constructor(agencyMembers: AgencyMemberDto[]) {
    this.data = agencyMembers
  }
}
