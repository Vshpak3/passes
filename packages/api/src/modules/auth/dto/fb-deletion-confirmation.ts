import { ApiProperty } from '@nestjs/swagger'

export class FacebookDeletionConfirmationDto {
  @ApiProperty()
  success: boolean

  constructor(success: boolean) {
    this.success = success
  }
}
