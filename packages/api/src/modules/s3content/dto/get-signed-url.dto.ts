import { DtoProperty } from '../../../web/dto.web'

export class GetSignedUrlResponseDto {
  @DtoProperty({ type: 'string' })
  url: string
}
