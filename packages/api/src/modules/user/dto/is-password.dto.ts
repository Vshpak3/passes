import { DtoProperty } from '../../../web/dto.web'

export class IsPasswordUserResponseDto {
  @DtoProperty({ type: 'boolean' })
  usesPassword: boolean

  constructor(usesPassword) {
    this.usesPassword = usesPassword
  }
}
