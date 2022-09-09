import { DtoProperty } from '../../../web/dto.web'
import { AdminDto } from './admin.dto'

export class CreateExternalPassRequestDto extends AdminDto {
  @DtoProperty()
  title: string

  @DtoProperty()
  description: string
}
