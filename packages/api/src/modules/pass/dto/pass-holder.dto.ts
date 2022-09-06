import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class PassHolderDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  passId: string

  @ApiProperty()
  holderId: string

  @ApiPropertyOptional()
  messages?: number | null

  @ApiPropertyOptional()
  expiresAt?: Date

  @ApiPropertyOptional()
  holderUsername?: string

  @ApiPropertyOptional()
  holderDisplayName?: string

  constructor(passHolder) {
    this.id = passHolder.id
    this.passId = passHolder.pass_id
    this.holderId = passHolder.holder_id
    this.expiresAt = passHolder.expires_at

    this.holderUsername = passHolder.username
    this.holderDisplayName = passHolder.display_name
  }
}
