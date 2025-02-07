import { Entity, Index, ManyToOne } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { ContentEntity } from '../../content/entities/content.entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity()
@Index({ properties: ['user_id', 'content_id'] })
export class UserMessageContentEntity extends BaseEntity {
  static table = 'user_message_content'

  @ManyToOne({ entity: () => UserEntity })
  user_id: string

  @ManyToOne({ entity: () => ContentEntity })
  content_id: string
}
