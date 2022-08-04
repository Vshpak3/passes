import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class BillingDetailsDto {
  @ApiProperty()
  name: string

  @ApiProperty()
  city: string

  @ApiProperty()
  country: string

  @ApiProperty()
  line1: string

  @ApiPropertyOptional()
  line2?: string

  @ApiPropertyOptional()
  district?: string

  @ApiProperty()
  postalCode: string
}
