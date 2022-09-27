import { DtoProperty } from '../../../../web/dto.web'

export class FacebookDeletionConfirmationDto {
  @DtoProperty({ type: 'boolean' })
  success: boolean

  constructor(success: boolean) {
    this.success = success
  }
}
