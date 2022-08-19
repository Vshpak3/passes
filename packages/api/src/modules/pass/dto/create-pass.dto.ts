import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsUrl, Length, Min } from 'class-validator'

import { PassTypeEnum } from '../enum/pass.enum'

export class CreatePassDto {
  @ApiProperty()
  @Length(1, 100)
  title: string

  @ApiProperty()
  @Length(1, 400)
  description: string

  @ApiProperty()
  @IsUrl()
  imageUrl: string

  @ApiProperty()
  type: PassTypeEnum

  @ApiProperty()
  @IsInt()
  @Min(0)
  price: number

  @ApiProperty()
  @IsInt()
  @Min(1)
  totalSupply: number

  @ApiPropertyOptional()
  @IsInt()
  @Min(1)
  duration?: number
}
