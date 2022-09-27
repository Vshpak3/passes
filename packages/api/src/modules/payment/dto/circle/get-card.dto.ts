import { DtoProperty } from '../../../../web/dto.web'
import { CircleCardDto } from './circle-card.dto'

export class GetCircleCardResponseDto extends CircleCardDto {}

export class GetCircleCardsResponseDto {
  @DtoProperty({ custom_type: [CircleCardDto] })
  cards: CircleCardDto[]

  constructor(cards: CircleCardDto[]) {
    this.cards = cards
  }
}
