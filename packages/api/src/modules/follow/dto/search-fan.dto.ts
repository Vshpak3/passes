import { ApiProperty } from '@nestjs/swagger'

export class SearchFanRequestDto {
  @ApiProperty()
  query: string

  @ApiProperty()
  cursor?: string
}
