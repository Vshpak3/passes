import { DtoProperty } from '../../../web/dto.web'
import { CreateExternalPassRequestDto } from './create-external-pass.dto'

export class UpdateExternalPassRequestDto extends CreateExternalPassRequestDto {
  @DtoProperty({ type: 'uuid' })
  passId: string
}
