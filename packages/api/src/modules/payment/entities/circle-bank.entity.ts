import {
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  Property,
  Unique,
} from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { AgencyEntity } from '../../agency/entities/agency.entity'
import { UserEntity } from '../../user/entities/user.entity'
import {
  CIRCLE_BANK_TRACKING_REF_LENGTH,
  CIRCLE_COUNTRY_LENGTH,
  CIRCLE_DESCRIPTION_LENGTH,
  CIRCLE_FINGERPRINT_LENGTH,
  CIRCLE_ID_LENGTH,
  CIRCLE_IDEMPOTENCY_KEY_LENGTH,
} from '../constants/schema'
import { CircleAccountStatusEnum } from '../enum/circle-account.status.enum'

@Entity()
export class CircleBankEntity extends BaseEntity {
  static table = 'circle_bank'

  @ManyToOne({ entity: () => UserEntity })
  user_id: string | null

  @OneToOne({ entity: () => AgencyEntity })
  agency_id: string | null

  @Property({ length: CIRCLE_IDEMPOTENCY_KEY_LENGTH })
  @Unique()
  idempotency_key: string

  @Property({ length: CIRCLE_ID_LENGTH })
  @Unique()
  circle_id: string | null

  @Property({ length: CIRCLE_COUNTRY_LENGTH })
  country: string

  @Enum(() => CircleAccountStatusEnum)
  status: CircleAccountStatusEnum

  @Property({ length: CIRCLE_DESCRIPTION_LENGTH })
  description: string

  @Property({ length: CIRCLE_BANK_TRACKING_REF_LENGTH })
  tracking_ref: string

  @Property({ length: CIRCLE_FINGERPRINT_LENGTH })
  fingerprint: string

  @Property({ length: 3 })
  deleted_at: Date | null
}
