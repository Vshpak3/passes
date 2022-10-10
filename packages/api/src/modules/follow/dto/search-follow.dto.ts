import { OmitType } from '@nestjs/swagger'

import {
  GetListMembersRequestDto,
  GetListMembersResponseDto,
} from '../../list/dto/get-list-members.dto'

export class SearchFollowRequestDto extends OmitType(GetListMembersRequestDto, [
  'listId',
]) {}

export class SearchFollowingResponseDto extends GetListMembersResponseDto {}

export class SearchFansResponseDto extends GetListMembersResponseDto {}

export class GetBlockedResponseDto extends GetListMembersResponseDto {}
