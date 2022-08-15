import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { MessageEntity } from '../../messages/entities/message.entity'
import { ContentEntity } from './content.entity'

@Entity({ tableName: 'content_message' })
@Unique({ properties: ['content', 'message'] })
export class ContentMessageEntity extends BaseEntity {
  @ManyToOne()
  content: ContentEntity

  @Property()
  message: MessageEntity
}
