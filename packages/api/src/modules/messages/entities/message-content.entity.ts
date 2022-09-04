import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { ContentEntity } from '../../content/entities/content.entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'message_content' })
@Index({ properties: ['user', 'content'] })
@Index({ properties: ['channelId', 'content'] })
export class MessageContentEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  user: UserEntity

  @Property()
  channelId: string

  @ManyToOne({ entity: () => ContentEntity })
  content: ContentEntity
}
