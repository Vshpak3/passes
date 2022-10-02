import { Entity, OneToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'creator_stat' })
export class CreatorStatEntity extends BaseEntity {
  @OneToOne({ entity: () => UserEntity })
  user_id: string

  @Property({ default: 0 })
  num_followers: number

  @Property({ default: 0 })
  num_likes: number

  @Property({ default: 0 })
  num_posts: number

  @Property({ default: 0 })
  num_media: number
}
