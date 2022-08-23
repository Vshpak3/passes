import { ApiProperty } from '@nestjs/swagger'

export class SearchUserRequestDto {
  @ApiProperty()
  query: string
}
