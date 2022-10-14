import { Entity, Enum, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { USER_LEGAL_FULL_NAME_LENGTH } from '../../user/constants/schema'
import { UserEntity } from '../../user/entities/user.entity'
import {
  CIRCLE_ID_LENGTH,
  CIRCLE_IDEMPOTENCY_KEY_LENGTH,
  CREDIT_CARD_NUMBER_LENGTH,
} from '../constants/schema'
import { CircleAccountStatusEnum } from '../enum/circle-account.status.enum'

@Entity()
export class CircleCardEntity extends BaseEntity {
  static table = 'circle_card'
  @ManyToOne({ entity: () => UserEntity })
  user_id: string

  @Property({ length: CIRCLE_IDEMPOTENCY_KEY_LENGTH })
  @Unique()
  idempotency_key: string

  @Property({ length: CIRCLE_ID_LENGTH })
  @Unique()
  circle_id: string | null

  @Enum(() => CircleAccountStatusEnum)
  status: CircleAccountStatusEnum

  @Property({ length: CREDIT_CARD_NUMBER_LENGTH })
  card_number: string

  @Property()
  exp_month: number

  @Property()
  exp_year: number

  @Property({ length: USER_LEGAL_FULL_NAME_LENGTH })
  name: string

  @Property()
  deleted_at: Date | null
}
