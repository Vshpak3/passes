import { OmitType } from '@nestjs/swagger'

import { DtoProperty } from '../../../web/dto.web'
import {
  GetListMembersRequestDto,
  GetListMembersResponseDto,
} from '../../list/dto/get-list-members.dto'

export class SearchFollowRequestDto extends OmitType(GetListMembersRequestDto, [
  'listId',
]) {
  @DtoProperty({ type: 'uuid', optional: true })
  excludeListId?: string
}

export class SearchFollowingResponseDto extends GetListMembersResponseDto {}

export class SearchFansResponseDto extends GetListMembersResponseDto {}

export class GetBlockedResponseDto extends GetListMembersResponseDto {}
