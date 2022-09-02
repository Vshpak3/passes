import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

// this is a debug endpoint used for testing
export class CreateSolNftRequestDto {
  @IsUUID()
  @ApiProperty()
  collectionId: string

  @IsUUID()
  @ApiProperty()
  walletId: string
}
