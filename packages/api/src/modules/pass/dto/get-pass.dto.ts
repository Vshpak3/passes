import { DtoProperty } from '../../../web/dto.web'
import { PassDto } from './pass.dto'

export class GetPassResponseDto extends PassDto {}

export class GetPassesResponseDto {
  @DtoProperty({ type: [PassDto] })
  passes: PassDto[]

  constructor(passes: PassDto[]) {
    this.passes = passes
  }
}
