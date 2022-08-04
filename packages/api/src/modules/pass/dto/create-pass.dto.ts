import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsUrl, Length, Min } from 'class-validator'

export class CreatePassDto {
  @ApiProperty()
  collectionId: string

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
  type: 'subscription' | 'lifetime'

  @ApiProperty()
  @IsInt()
  @Min(0)
  price: number

  @ApiProperty()
  @IsInt()
  @Min(1)
  totalSupply: number
}
