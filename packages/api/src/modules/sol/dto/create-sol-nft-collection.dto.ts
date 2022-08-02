import { ApiProperty } from '@nestjs/swagger'

// this is a debug endpoint used for testing
export class CreateSolNftCollectionDto {
  @ApiProperty()
  name: string

  @ApiProperty()
  symbol: string
}
