import { Entity, OneToOne, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import {
  EXTERNAL_USERNAME_LENGTH,
  PROFILE_COVER_DESCRIPTION_LENGTH,
  PROFILE_COVER_TITLE_LENGTH,
  PROFILE_DESCRIPTION_LENGTH,
} from '../constants/schema'

@Entity({ tableName: 'profile' })
export class ProfileEntity extends BaseEntity {
  @OneToOne()
  user: UserEntity

  @Property({ length: PROFILE_COVER_TITLE_LENGTH })
  coverTitle?: string

  @Property({ type: types.text, length: PROFILE_COVER_DESCRIPTION_LENGTH })
  coverDescription?: string

  @Property({ type: types.text, length: PROFILE_DESCRIPTION_LENGTH })
  description?: string

  @Property({ length: EXTERNAL_USERNAME_LENGTH })
  discordUsername?: string

  @Property({ length: EXTERNAL_USERNAME_LENGTH })
  facebookUsername?: string

  @Property({ length: EXTERNAL_USERNAME_LENGTH })
  instagramUsername?: string

  @Property({ length: EXTERNAL_USERNAME_LENGTH })
  tiktokUsername?: string

  @Property({ length: EXTERNAL_USERNAME_LENGTH })
  twitchUsername?: string

  @Property({ length: EXTERNAL_USERNAME_LENGTH })
  twitterUsername?: string

  @Property({ length: EXTERNAL_USERNAME_LENGTH })
  youtubeUsername?: string

  @Property({ default: true })
  isActive: boolean
}
