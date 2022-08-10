import { ApiProperty } from '@nestjs/swagger'

import { GetPassDto } from './get-pass.dto'

export class GetPassesDto {
  @ApiProperty()
  passes: GetPassDto

  constructor(passEntities) {
    this.passes = passEntities.map((m) => new GetPassDto(m))
  }
}
