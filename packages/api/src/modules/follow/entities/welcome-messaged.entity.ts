import { Entity, ManyToOne, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'welcome_messaged' })
@Unique({ properties: ['follower', 'creator'] })
export class WelcomeMessaged extends BaseEntity {
  @ManyToOne()
  follower: UserEntity

  @ManyToOne()
  creator: UserEntity
}
