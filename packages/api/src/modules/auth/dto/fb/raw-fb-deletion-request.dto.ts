import { DtoProperty } from '../../../../web/dto.web'

export class RawFacebookDeletionRequestDto {
  @DtoProperty()
  signed_request: string
}
