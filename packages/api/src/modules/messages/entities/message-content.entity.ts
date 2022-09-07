import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { ContentEntity } from '../../content/entities/content.entity'
import { UserEntity } from '../../user/entities/user.entity'
import { CHANNEL_ID_LENGTH } from '../constants/schema'

@Entity({ tableName: 'message_content' })
@Index({ properties: ['user', 'content'] })
@Index({ properties: ['channelId', 'content'] })
export class MessageContentEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  user: UserEntity

  @Property({ length: CHANNEL_ID_LENGTH })
  channelId: string

  @ManyToOne({ entity: () => ContentEntity })
  content: ContentEntity
}
