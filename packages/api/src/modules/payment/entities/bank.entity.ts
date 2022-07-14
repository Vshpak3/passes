import { Entity, Enum, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { AccountStatusEnum } from '../enum/account.status.enum'

@Entity({ tableName: 'bank' })
export class BankEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  user: UserEntity

  @Property()
  @Unique()
  circleBankId: string

  @Enum(() => AccountStatusEnum)
  status: AccountStatusEnum

  @Property()
  description: string

  @Property()
  trackingRef: string

  @Property()
  fingerprint: string

  @Property()
  isDefault: boolean
}
