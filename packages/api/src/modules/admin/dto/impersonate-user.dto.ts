import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class ImpersonateUserRequestDto {
  @IsUUID()
  @ApiPropertyOptional()
  userId?: string

  @ApiPropertyOptional()
  username?: string

  @ApiProperty()
  secret: string
}

export class ImpersonateUserResponseDto {
  @ApiProperty()
  accessToken: string

  public constructor(accessToken: string) {
    this.accessToken = accessToken
  }
}
