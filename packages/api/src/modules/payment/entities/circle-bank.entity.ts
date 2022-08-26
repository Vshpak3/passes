import { Entity, Enum, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import {
  CIRCLE_BANK_TRACKING_REF_LENGTH,
  CIRCLE_DESCRIPTION_LENGTH,
  CIRCLE_FINGERPRINT_LENGTH,
  CIRCLE_ID_LENGTH,
  CIRCLE_IDEMPOTENCY_KEY_LENGTH,
} from '../constants/schema'
import { CircleAccountStatusEnum } from '../enum/circle-account.status.enum'

@Entity({ tableName: 'circle_bank' })
export class CircleBankEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  user: UserEntity

  @Property({ length: CIRCLE_IDEMPOTENCY_KEY_LENGTH })
  @Unique()
  idempotencyKey: string

  @Property({ length: CIRCLE_ID_LENGTH })
  @Unique()
  circleBankId?: string

  @Enum(() => CircleAccountStatusEnum)
  status: CircleAccountStatusEnum

  @Property({ length: CIRCLE_DESCRIPTION_LENGTH })
  description: string

  @Property({ length: CIRCLE_BANK_TRACKING_REF_LENGTH })
  trackingRef: string

  @Property({ length: CIRCLE_FINGERPRINT_LENGTH })
  fingerprint: string

  @Property()
  deletedAt?: Date
}
