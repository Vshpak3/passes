import { DtoProperty } from '../../../web/dto.web'
import { UserEntity } from '../entities/user.entity'
import { UserDisplayInfoDto } from './user-display-info.dto'

export class SearchCreatorRequestDto {
  @DtoProperty({ type: 'string' })
  query: string
}

export class SearchCreatorResponseDto {
  @DtoProperty({ custom_type: [UserDisplayInfoDto] })
  creators: UserDisplayInfoDto[]

  constructor(creators: UserEntity[]) {
    this.creators = creators.map((c) => ({
      userId: c.id,
      username: c.username,
      displayName: c.display_name,
    }))
  }
}
