import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { ContentEntity } from './content.entity'

@Entity({ tableName: 'content_message' })
@Unique({ properties: ['content', 'sender', 'recipient'] })
export class ContentMessageEntity extends BaseEntity {
  @ManyToOne()
  content: ContentEntity

  @Property()
  message_id: string

  @ManyToOne()
  recipient: UserEntity

  @ManyToOne()
  sender: UserEntity
}
