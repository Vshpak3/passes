import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class MetaData {
  @ApiPropertyOptional()
  email?: string
  @ApiPropertyOptional()
  phoneNumber?: string
  @ApiProperty()
  sessionId: string
  @ApiProperty()
  ipAddress: string
}
