import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  Property,
  types,
  Unique,
  UuidType,
} from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { ScheduledEventTypeEnum } from '../enum/scheduled-event.type.enum'

@Entity()
export class ScheduledEventEntity extends BaseEntity {
  static table = 'scheduled_event'

  @ManyToOne({ entity: () => UserEntity })
  user_id: string

  @Enum(() => ScheduledEventTypeEnum)
  type: ScheduledEventTypeEnum

  @Property({ type: types.json })
  body: any

  @Index()
  @Property()
  scheduled_at: Date

  @Property()
  deleted_at: Date | null

  @Unique()
  @Property({
    type: new UuidType(),
  })
  processor: string | null

  @Property({
    default: false,
  })
  processed: boolean
}
