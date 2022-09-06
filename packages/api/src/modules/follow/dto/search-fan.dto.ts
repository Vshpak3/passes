import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class SearchFanRequestDto {
  @ApiProperty()
  query: string

  @ApiPropertyOptional()
  cursor?: string
}
