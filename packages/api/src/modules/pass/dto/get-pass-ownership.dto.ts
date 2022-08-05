import { ApiProperty } from '@nestjs/swagger'

export class GetPassOwnershipDto {
  @ApiProperty()
  passId: string

  @ApiProperty()
  holder: string

  @ApiProperty()
  expiresAt?: number

  constructor(passId, holder, expiresAt) {
    this.passId = passId
    this.holder = holder
    this.expiresAt = expiresAt
  }
}
