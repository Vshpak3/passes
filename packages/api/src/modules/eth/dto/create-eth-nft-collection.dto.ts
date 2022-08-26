import { ApiProperty } from '@nestjs/swagger'

export class CreateEthNftCollectionRequestDto {
  @ApiProperty()
  tokenAddress: string

  @ApiProperty()
  name: string
}
