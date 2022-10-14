import { Entity, OneToOne, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import {
  EXTERNAL_USERNAME_LENGTH,
  PROFILE_COVER_DESCRIPTION_LENGTH,
  PROFILE_COVER_TITLE_LENGTH,
  PROFILE_DESCRIPTION_LENGTH,
} from '../constants/schema'

@Entity()
export class ProfileEntity extends BaseEntity {
  static table = 'profile'
  @OneToOne({ entity: () => UserEntity })
  user_id: string

  @Property({ length: PROFILE_COVER_TITLE_LENGTH })
  cover_title: string | null

  @Property({ type: types.text, length: PROFILE_COVER_DESCRIPTION_LENGTH })
  cover_description: string | null

  @Property({ type: types.text, length: PROFILE_DESCRIPTION_LENGTH })
  description: string | null

  @Property({ length: EXTERNAL_USERNAME_LENGTH })
  discord_username: string | null

  @Property({ length: EXTERNAL_USERNAME_LENGTH })
  facebook_username: string | null

  @Property({ length: EXTERNAL_USERNAME_LENGTH })
  instagram_username: string | null

  @Property({ length: EXTERNAL_USERNAME_LENGTH })
  tiktok_username: string | null

  @Property({ length: EXTERNAL_USERNAME_LENGTH })
  twitch_username: string | null

  @Property({ length: EXTERNAL_USERNAME_LENGTH })
  twitter_username: string | null

  @Property({ length: EXTERNAL_USERNAME_LENGTH })
  youtube_username: string | null

  @Property({ default: true })
  is_active: boolean
}
