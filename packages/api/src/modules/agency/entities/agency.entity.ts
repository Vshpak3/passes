import { Entity, OneToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { USD_AMOUNT_TYPE } from '../../payment/constants/schema'
import { CircleBankEntity } from '../../payment/entities/circle-bank.entity'
import { USER_EMAIL_LENGTH } from '../../user/constants/schema'
import { AGENCY_NAME_LENGTH } from '../constants/schema'

@Entity({ tableName: 'agency' })
export class AgencyEntity extends BaseEntity {
  static table = 'agency'

  @Property({ length: AGENCY_NAME_LENGTH })
  @Unique()
  name: string

  @Property({ length: USER_EMAIL_LENGTH })
  @Unique()
  email: string

  @OneToOne(() => CircleBankEntity)
  bank_id: string

  @Property({ columnType: USD_AMOUNT_TYPE })
  available_balance: number
}
