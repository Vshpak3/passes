import { DtoProperty } from '../../../web/dto.web'

export class DeletePostCategoryRequestDto {
  @DtoProperty({ type: 'uuid' })
  postCategoryId: string
}
