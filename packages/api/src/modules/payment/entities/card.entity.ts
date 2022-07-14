import { Entity, Enum, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { AccountStatusEnum } from '../enum/account.status.enum'

@Entity({ tableName: 'card' })
export class CardEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  user: UserEntity

  @Property()
  @Unique()
  circleCardId: string

  @Enum(() => AccountStatusEnum)
  status: AccountStatusEnum

  @Property()
  isDefault: boolean

  @Property()
  fourDigits: string

  @Property()
  expMonth: number

  @Property()
  expYear: number

  @Property()
  name: string

  @Property()
  active = true
}
