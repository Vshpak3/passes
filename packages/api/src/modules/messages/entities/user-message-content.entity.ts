import { Entity, Index, ManyToOne } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { ContentEntity } from '../../content/entities/content.entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'user_message_content' })
@Index({ properties: ['user', 'content'] })
export class UserMessageContentEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  user: UserEntity

  @ManyToOne({ entity: () => ContentEntity })
  content: ContentEntity
}
