import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'channel_settings' })
@Unique({ properties: ['user', 'channelId'] })
export class ChannelSettingsEntity extends BaseEntity {
  @Property()
  channelId: string

  @ManyToOne({ entity: () => UserEntity })
  user?: UserEntity

  @Property({ default: false })
  unlimitedMessages: boolean
}
