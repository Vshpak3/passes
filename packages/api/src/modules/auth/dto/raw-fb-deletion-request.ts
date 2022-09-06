import { DtoProperty } from '../../../web/endpoint.web'

export class RawFacebookDeletionRequestDto {
  @DtoProperty()
  signed_request: string
}
