import { Entity, OneToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { PaymentEntity } from './payment.entity'

@Entity({ tableName: 'deposit_address' })
export class DepositAddressEntity extends BaseEntity {
  @OneToOne()
  payment: PaymentEntity

  @Property()
  @Unique()
  address: string
}
