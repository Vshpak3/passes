import { Entity, OneToOne, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import {
  EXTERNAL_URL_LENGTH,
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

  @Property({ length: EXTERNAL_URL_LENGTH })
  instagramUrl?: string

  @Property({ length: EXTERNAL_URL_LENGTH })
  tiktokUrl?: string

  @Property({ length: EXTERNAL_URL_LENGTH })
  youtubeUrl?: string

  @Property({ length: EXTERNAL_URL_LENGTH })
  discordUrl?: string

  @Property({ length: EXTERNAL_URL_LENGTH })
  twitchUrl?: string

  @Property({ default: true })
  isActive: boolean
}
