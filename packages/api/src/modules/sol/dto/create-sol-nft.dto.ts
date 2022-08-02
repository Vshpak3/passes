import { ApiProperty } from '@nestjs/swagger'

// this is a debug endpoint used for testing
export class CreateSolNftDto {
  @ApiProperty()
  collectionId: string

  @ApiProperty()
  owner: string
}
