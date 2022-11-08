import { Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { ContentBareDto } from '../../content/dto/content-bare'
import { MESSAGE_LENGTH } from '../constants/schema'
import { PaidMessageEntity } from '../entities/paid-message.entity'

export class PaidMessageDto {
  @DtoProperty({ type: 'uuid' })
  paidMessageId: string

  @DtoProperty({ type: 'uuid' })
  creatorId: string

  @Length(1, MESSAGE_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  text: string

  @Min(0)
  @DtoProperty({ type: 'currency' })
  price: number

  @DtoProperty({ custom_type: [ContentBareDto] })
  bareContents: ContentBareDto[]

  @DtoProperty({ type: 'number' })
  previewIndex: number

  @Min(0)
  @DtoProperty({ type: 'number' })
  numPurchases: number

  @Min(0)
  @DtoProperty({ type: 'currency' })
  earningsPurchases: number

  @DtoProperty({ type: 'date' })
  createdAt: Date

  @DtoProperty({ type: 'boolean' })
  isWelcomeMesage: boolean

  @DtoProperty({ type: 'date', nullable: true })
  unsent_at: Date | null

  @DtoProperty({ type: 'number' })
  sentTo: number

  constructor(paidMessage: PaidMessageEntity | undefined) {
    if (paidMessage) {
      this.paidMessageId = paidMessage.id
      this.creatorId = paidMessage.creator_id
      this.text = paidMessage.text
      this.price = paidMessage.price
      this.bareContents = JSON.parse(paidMessage.contents)
      this.previewIndex = paidMessage.preview_index
      this.numPurchases = paidMessage.num_purchases
      this.earningsPurchases = paidMessage.earnings_purchases
      this.createdAt = paidMessage.created_at
      this.isWelcomeMesage = paidMessage.is_welcome_message
      this.unsent_at = paidMessage.unsent_at
      this.sentTo = paidMessage.sent_to
    }
  }
}
