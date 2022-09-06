import { DtoProperty } from '../../../web/endpoint.web'

export class CreateListRequestDto {
  @DtoProperty()
  name: string

  @DtoProperty()
  userIds: string[]
}
