import { DtoProperty } from '../../../web/dto.web'
import { AdminDto } from './admin.dto'

export class ImpersonateUserRequestDto extends AdminDto {}

export class ImpersonateUserResponseDto {
  @DtoProperty()
  accessToken: string

  public constructor(accessToken: string) {
    this.accessToken = accessToken
  }
}
