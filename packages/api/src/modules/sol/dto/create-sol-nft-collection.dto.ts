import { ApiProperty } from '@nestjs/swagger'

export class CreateSolNftCollectionDto {
  @ApiProperty()
  name: string

  @ApiProperty()
  symbol: string

  @ApiProperty()
  uriMetadata: string
}
