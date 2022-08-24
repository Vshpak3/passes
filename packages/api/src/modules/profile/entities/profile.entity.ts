import { Entity, OneToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'profile' })
export class ProfileEntity extends BaseEntity {
  @OneToOne()
  user: UserEntity

  @Property({ length: 255 })
  displayName?: string

  @Property({ length: 255 })
  coverTitle?: string

  @Property({ length: 255 })
  coverDescription?: string

  @Property({ length: 255 })
  description?: string

  @Property({ length: 255 })
  profileImageUrl?: string

  @Property({ length: 255 })
  profileCoverImageUrl?: string

  @Property({ length: 255 })
  instagramUrl?: string

  @Property({ length: 255 })
  tiktokUrl?: string

  @Property({ length: 255 })
  youtubeUrl?: string

  @Property({ length: 255 })
  discordUrl?: string

  @Property({ length: 255 })
  twitchUrl?: string

  @Property()
  isActive: boolean

  // @Property()
  // totalPosts: number

  // @Property()
  // totalLikes: number
}
