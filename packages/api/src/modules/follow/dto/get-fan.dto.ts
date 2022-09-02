import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'
export class GetFanResponseDto {
  @IsUUID()
  @ApiProperty()
  userId: string

  @ApiProperty()
  username: string

  @ApiProperty()
  displayName?: string

  @ApiProperty()
  profileImageUrl?: string

  constructor(
    userId: string,
    username: string,
    displayName?: string,
    profileImageUrl?: string,
  ) {
    this.userId = userId
    this.username = username
    this.displayName = displayName
    this.profileImageUrl = profileImageUrl
  }
}

export class GetFansResponseDto {
  @ApiProperty({ type: GetFanResponseDto })
  fans: GetFanResponseDto[]

  constructor(fans: GetFanResponseDto[]) {
    this.fans = fans
  }
}
