import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class PassHolderDto {
  @IsUUID()
  @ApiProperty()
  id: string

  @IsUUID()
  @ApiProperty()
  passId: string

  @IsUUID()
  @ApiProperty()
  holderId: string

  @ApiProperty()
  expiresAt?: number

  constructor(passHolder) {
    this.id = passHolder.id
    this.passId = passHolder.pass_id
    this.holderId = passHolder.holder_id
    this.expiresAt = passHolder.expires_at
  }
}
