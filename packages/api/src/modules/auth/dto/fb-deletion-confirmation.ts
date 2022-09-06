import { DtoProperty } from '../../../web/dto.web'

export class FacebookDeletionConfirmationDto {
  @DtoProperty()
  success: boolean

  constructor(success: boolean) {
    this.success = success
  }
}
