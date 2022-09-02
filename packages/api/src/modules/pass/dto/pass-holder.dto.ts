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
  expiresAt?: number

  constructor(passHolder) {
    this.id = passHolder.id
    this.passId = passHolder.pass_id
    this.holderId = passHolder.holder_id
    this.expiresAt = passHolder.expires_at
  }
}
