import { ApiProperty } from '@nestjs/swagger'

export class CreateSolNftDto {
  @ApiProperty()
  collectionId: string

  @ApiProperty()
  owner: string

  @ApiProperty()
  signature: string

  @ApiProperty()
  uriMetadata: string
}
