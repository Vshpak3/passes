import { DtoProperty } from '../../../web/dto.web'

export class IsPasswordUserResponseDto {
  @DtoProperty()
  usesPassword: boolean

  constructor(usesPassword) {
    this.usesPassword = usesPassword
  }
}
