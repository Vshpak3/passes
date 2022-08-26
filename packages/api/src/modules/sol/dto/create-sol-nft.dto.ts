import { ApiProperty } from '@nestjs/swagger'

// this is a debug endpoint used for testing
export class CreateSolNftRequestDto {
  @ApiProperty()
  collectionId: string

  @ApiProperty()
  walletId: string
}
