import { DtoProperty } from '../../../web/dto.web'
import { AdminDto } from './admin.dto'

export class UserExternalPassRequestDto extends AdminDto {
  @DtoProperty({ type: 'uuid' })
  userId: string

  @DtoProperty({ type: 'uuid' })
  passId: string
}
