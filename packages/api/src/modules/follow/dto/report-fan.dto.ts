import { ApiProperty } from '@nestjs/swagger'

export class ReportFanDto {
  @ApiProperty()
  reason: string
}
