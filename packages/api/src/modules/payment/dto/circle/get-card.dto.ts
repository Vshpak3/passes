import { ApiProperty } from '@nestjs/swagger'

import { CircleCardDto } from './circle-card.dto'

export class GetCircleCardResponseDto extends CircleCardDto {}

export class GetCircleCardsResponseDto {
  @ApiProperty({ type: [CircleCardDto] })
  cards: CircleCardDto[]

  constructor(cards: CircleCardDto[]) {
    this.cards = cards
  }
}
