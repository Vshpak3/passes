import { DtoProperty } from '../../../web/dto.web'
import { UserEntity } from '../entities/user.entity'
import { CreatorInfoDto } from './creator-info.dto'

export class SearchCreatorRequestDto {
  @DtoProperty()
  query: string
}

export class SearchCreatorResponseDto {
  @DtoProperty()
  creators: CreatorInfoDto[]

  constructor(creators: UserEntity[]) {
    this.creators = creators.map((c) => new CreatorInfoDto(c))
  }
}
