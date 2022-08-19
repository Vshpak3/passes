import { ApiProperty } from '@nestjs/swagger'

import { GetPassDto } from '../../pass/dto/get-pass.dto'
import { GetPassOwnershipDto } from '../../pass/dto/get-pass-ownership.dto'

export class PayinTargetDto {
  @ApiProperty()
  target?: string

  @ApiProperty()
  passId?: string

  @ApiProperty()
  passOwnershipId?: string

  @ApiProperty()
  pass?: GetPassDto

  @ApiProperty()
  passOwnership?: GetPassOwnershipDto
}
