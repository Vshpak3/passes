import { DtoProperty } from '../../../web/dto.web'
import { ProfileDto } from './profile.dto'

export class GetProfileResponseDto extends ProfileDto {}

export class GetProfileRequestDto {
  @DtoProperty({ required: false })
  creatorId?: string

  @DtoProperty({ required: false })
  username?: string

  @DtoProperty({ required: false })
  profileId?: string
}
