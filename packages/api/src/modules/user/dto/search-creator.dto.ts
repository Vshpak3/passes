import { DtoProperty } from '../../../web/dto.web'
import { UserEntity } from '../entities/user.entity'
import { CreatorInfoDto } from './creator-info.dto'

export class SearchCreatorRequestDto {
  @DtoProperty({ type: 'string' })
  query: string
}

export class SearchCreatorResponseDto {
  @DtoProperty({ custom_type: [CreatorInfoDto] })
  creators: CreatorInfoDto[]

  constructor(creators: UserEntity[]) {
    this.creators = creators.map((c) => ({
      id: c.id,
      username: c.username,
      displayName: c.display_name,
    }))
  }
}
