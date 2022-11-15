import { PickType } from '@nestjs/swagger'

import { PageRequestDto, PageResponseDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'
import { UserDto } from '../../user/dto/user.dto'
import { UserEntity } from '../../user/entities/user.entity'
import { PostUserAccessEntity } from '../entities/post-user-access.entity'

export class PostBuyerDto extends PickType(UserDto, [
  'userId',
  'username',
  'displayName',
]) {
  @DtoProperty({ type: 'uuid' })
  postUserAccessId: string

  @DtoProperty({ type: 'date', nullable: true })
  paidAt: Date | null

  constructor(postBuyer: PostUserAccessEntity & UserEntity) {
    super()
    if (postBuyer) {
      this.postUserAccessId = postBuyer.id
      this.paidAt = postBuyer.paid_at
      this.userId = postBuyer.user_id
      this.username = postBuyer.username
      this.displayName = postBuyer.display_name
    }
  }
}

export class GetPostBuyersRequestDto extends PickType(PageRequestDto, [
  'lastId',
  'search',
]) {
  @DtoProperty({ type: 'uuid' })
  postId: string

  @DtoProperty({ type: 'date', optional: true })
  paidAt?: Date
}

export class GetPostBuyersResponseDto
  extends GetPostBuyersRequestDto
  implements PageResponseDto<PostBuyerDto>
{
  @DtoProperty({ custom_type: [PostBuyerDto] })
  data: PostBuyerDto[]

  constructor(
    postBuyers: PostBuyerDto[],
    requestDto: Partial<GetPostBuyersRequestDto>,
  ) {
    super()
    for (const key in requestDto) {
      this[key] = requestDto[key]
    }
    this.lastId = undefined
    this.data = postBuyers

    if (postBuyers.length > 0) {
      this.lastId = postBuyers[postBuyers.length - 1].postUserAccessId
      this.paidAt = postBuyers[postBuyers.length - 1].paidAt ?? undefined
    }
  }
}
