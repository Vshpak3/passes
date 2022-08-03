import { Length } from 'class-validator'

export class CreateCollectionDto {
  @Length(1, 100)
  title: string

  @Length(1, 400)
  description: string

  blockchain: 'solana'
}
