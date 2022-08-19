import { ApiProperty } from '@nestjs/swagger'

export class GetPassOwnershipDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  passId: string

  @ApiProperty()
  holderId: string

  @ApiProperty()
  expiresAt?: number

  constructor(passOwnership) {
    this.id = passOwnership.id
    this.passId = passOwnership.pass_id
    this.holderId = passOwnership.holder_id
    this.expiresAt = passOwnership.expires_at
  }
}
