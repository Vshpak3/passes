import { DtoProperty } from '../../../web/endpoint.web'

export class FacebookDeletionConfirmationDto {
  @DtoProperty()
  success: boolean

  constructor(success: boolean) {
    this.success = success
  }
}
