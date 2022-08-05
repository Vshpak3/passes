import { ApiProperty } from '@nestjs/swagger'

export class CreatePassHolderDto {
  @ApiProperty()
  passId: string

  @ApiProperty()
  temporary: boolean
}
