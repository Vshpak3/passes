import { ApiPropertyOptional } from '@nestjs/swagger'

export class CircleMetaDataDto {
  @ApiPropertyOptional()
  email?: string

  @ApiPropertyOptional()
  phoneNumber?: string

  @ApiPropertyOptional()
  sessionId?: string

  @ApiPropertyOptional()
  ipAddress?: string

  @ApiPropertyOptional()
  beneficiaryEmail?: string
}
