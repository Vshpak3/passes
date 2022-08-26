import { ApiProperty } from '@nestjs/swagger'

import { PassDto } from './pass.dto'

export class GetPassResponseDto extends PassDto {}

export class GetPassesResponseDto {
  @ApiProperty({ type: [PassDto] })
  passes: PassDto[]

  constructor(passes: PassDto[]) {
    this.passes = passes
  }
}
