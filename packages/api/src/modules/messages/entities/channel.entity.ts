import { Entity, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { STREAM_CHANNEL_ID_LENGTH } from '../constants/schema'

@Entity({ tableName: 'channel' })
export class ChannelEntity extends BaseEntity {
  @Property({ length: STREAM_CHANNEL_ID_LENGTH })
  streamChannelId: string

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  recent: Date
}
