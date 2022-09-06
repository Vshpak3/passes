import { DtoProperty } from '../../../web/dto.web'

export class CreateListRequestDto {
  @DtoProperty()
  name: string

  @DtoProperty()
  userIds: string[]
}
