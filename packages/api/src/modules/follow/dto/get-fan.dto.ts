import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/endpoint.web'
export class GetFanResponseDto {
  @IsUUID()
  @DtoProperty()
  userId: string

  @DtoProperty()
  username: string

  @DtoProperty({ required: false })
  displayName?: string

  constructor(fan) {
    if (fan) {
      this.userId = fan.user_id
      this.username = fan.username
      this.displayName = fan.display_name
    }
  }
}

export class GetFansResponseDto {
  @DtoProperty({ type: GetFanResponseDto })
  fans: GetFanResponseDto[]

  constructor(fans: GetFanResponseDto[]) {
    this.fans = fans
  }
}
