import { DtoProperty } from '../../../web/endpoint.web'
import { UserEntity } from '../entities/user.entity'
import { GetUserResponseDto } from './get-user.dto'

export class SearchCreatorRequestDto {
  @DtoProperty()
  query: string
}

export class SearchCreatorResponseDto {
  @DtoProperty()
  creators: GetUserResponseDto[]

  constructor(creators: UserEntity[]) {
    this.creators = creators.map((c) => new GetUserResponseDto(c))
  }
}
