import { DtoProperty } from '../../../web/endpoint.web'

export class GetUsernamesResponseDto {
  @DtoProperty()
  usernames: string[]
}
