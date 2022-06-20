import { Entity, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'

@Entity()
export class Profile extends BaseEntity {
  @Property()
  userId: number

  @Property()
  description: string

  @Property()
  unsubscribedAt: Date = new Date()

  @Property()
  isCreator: boolean

  @Property({ nullable: true })
  instagramUrl?: string

  @Property({ nullable: true })
  tiktokUrl?: string

  @Property({ nullable: true })
  youtubeUrl?: string

  @Property({ nullable: true })
  discordUrl?: string

  @Property({ nullable: true })
  twitchUrl?: string

  @Property({ nullable: true })
  subscribersId?: number

  @Property()
  totalPosts: number

  @Property()
  totalLikes: number
}
