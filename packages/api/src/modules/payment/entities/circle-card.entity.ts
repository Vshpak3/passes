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

@Entity({ tableName: 'circle_card' })
export class CircleCardEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  user: UserEntity

  @Property({ length: CIRCLE_IDEMPOTENCY_KEY_LENGTH })
  @Unique()
  idempotencyKey: string

  @Property({ length: CIRCLE_ID_LENGTH })
  @Unique()
  circleCardId?: string

  @Enum(() => CircleAccountStatusEnum)
  status: CircleAccountStatusEnum

  @Property({ length: CREDIT_CARD_NUMBER_LENGTH })
  cardNumber: string

  @Property()
  expMonth: number

  @Property()
  expYear: number

  @Property({ length: USER_LEGAL_FULL_NAME_LENGTH })
  name: string

  @Property()
  deletedAt?: Date
}
