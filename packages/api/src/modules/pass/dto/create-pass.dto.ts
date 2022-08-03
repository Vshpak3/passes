import { IsInt, IsUrl, Length, Min } from 'class-validator'

export class CreatePassDto {
  collectionId: string

  @Length(1, 100)
  title: string

  @Length(1, 400)
  description: string

  @IsUrl()
  imageUrl: string

  type: 'subscription' | 'lifetime'

  @IsInt()
  @Min(0)
  price: number

  @IsInt()
  @Min(1)
  totalSupply: number
}
