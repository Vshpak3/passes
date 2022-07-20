import { ApiProperty } from '@nestjs/swagger'

export class CreateCreatorSettingsDto {
  @ApiProperty()
  minimumTipAmount: number
}
