import { DtoProperty } from '../../../web/dto.web'

export class DeleteContentRequestDto {
  @DtoProperty({ type: 'uuid[]' })
  contentIds: string[]
}
