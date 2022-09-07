import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { PostEntity } from '../../post/entities/post.entity'
import { UserEntity } from '../../user/entities/user.entity'
import { CHANNEL_ID_LENGTH } from '../constants/schema'

@Entity({ tableName: 'message_post' })
@Index({ properties: ['user', 'post'] })
@Index({ properties: ['channelId', 'post'] })
export class MessagePostEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  user: UserEntity

  @Property({ length: CHANNEL_ID_LENGTH })
  channelId: PostEntity

  @ManyToOne({ entity: () => PostEntity })
  post: PostEntity
}
