import { ApiProperty } from '@nestjs/swagger'

export class GetFanDto {
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
