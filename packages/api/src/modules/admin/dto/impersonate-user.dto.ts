import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class ImpersonateUserRequestDto {
  @IsUUID()
  @ApiProperty()
  userId: string

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
