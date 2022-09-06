import { DtoProperty } from '../../../web/dto.web'

export class GetUsernamesResponseDto {
  @DtoProperty()
  usernames: string[]
}
