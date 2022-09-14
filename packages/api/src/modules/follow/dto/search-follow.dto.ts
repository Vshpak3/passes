import { OmitType } from '@nestjs/swagger'

import { GetListMembersRequestDto } from '../../list/dto/get-list-members.dto'

export class SearchFollowRequestDto extends OmitType(GetListMembersRequestDto, [
  'listId',
]) {}
