import { DtoProperty } from '../../../../web/dto.web'

export class RawFacebookDeletionRequestDto {
  @DtoProperty({ type: 'string' })
  signed_request: string
}
