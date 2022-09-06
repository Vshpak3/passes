import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'
export class GetFanResponseDto {
  @IsUUID()
  @ApiProperty()
  userId: string

  @ApiProperty()
  username: string

  @ApiPropertyOptional()
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
  @ApiProperty({ type: GetFanResponseDto })
  fans: GetFanResponseDto[]

  constructor(fans: GetFanResponseDto[]) {
    this.fans = fans
  }
}
