import { DtoProperty } from '../../../web/endpoint.web'
import { PassDto } from './pass.dto'

export class GetPassResponseDto extends PassDto {}

export class GetPassesResponseDto {
  @DtoProperty({ type: [PassDto] })
  passes: PassDto[]

  constructor(passes: PassDto[]) {
    this.passes = passes
  }
}
