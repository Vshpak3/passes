import { DtoProperty } from '../../../../web/endpoint.web'
import { CircleCardDto } from './circle-card.dto'

export class GetCircleCardResponseDto extends CircleCardDto {}

export class GetCircleCardsResponseDto {
  @DtoProperty({ type: [CircleCardDto] })
  cards: CircleCardDto[]

  constructor(cards: CircleCardDto[]) {
    this.cards = cards
  }
}
