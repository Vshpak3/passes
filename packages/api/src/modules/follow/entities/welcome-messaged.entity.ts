import { Entity, ManyToOne, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity()
@Unique({ properties: ['follower_id', 'creator_id'] })
export class WelcomeMessagedEntity extends BaseEntity {
  static table = 'welcome_messaged'

  @ManyToOne({ entity: () => UserEntity })
  follower_id: string

  @ManyToOne({ entity: () => UserEntity })
  creator_id: string
}
