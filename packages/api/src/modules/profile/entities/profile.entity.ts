import { Entity, OneToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'profile' })
export class ProfileEntity extends BaseEntity {
  @OneToOne()
  user: UserEntity

  @Property()
  description?: string

  @Property()
  profileImageUrl?: string

  @Property()
  instagramUrl?: string

  @Property()
  tiktokUrl?: string

  @Property()
  youtubeUrl?: string

  @Property()
  discordUrl?: string

  @Property()
  twitchUrl?: string

  @Property()
  isActive: boolean

  // @Property()
  // totalPosts: number

  // @Property()
  // totalLikes: number
}
