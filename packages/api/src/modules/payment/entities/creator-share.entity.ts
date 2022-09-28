import { Entity, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { USD_AMOUNT_TYPE } from '../constants/schema'
import { PayinEntity } from './payin.entity'

@Entity({ tableName: 'creator_share' })
export class CreatorShareEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  creator_id: string

  @Property({ columnType: USD_AMOUNT_TYPE })
  amount: number

  @ManyToOne({ entity: () => PayinEntity })
  payin_id: string
}
