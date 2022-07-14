import { ApiProperty } from '@nestjs/swagger'

export class CreateEthNftCollectionDto {
  @ApiProperty()
  tokenAddress: string

  @ApiProperty()
  name: string
}
