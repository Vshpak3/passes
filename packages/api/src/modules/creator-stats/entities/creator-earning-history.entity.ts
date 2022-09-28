import { Entity, Enum, Index, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { USD_AMOUNT_TYPE } from '../../payment/constants/schema'
import { UserEntity } from '../../user/entities/user.entity'
import { EarningTypeEnum } from '../enum/earning.type.enum'

@Entity({ tableName: 'creator_earning_history' })
@Index({ properties: ['created_at'] })
export class CreatorEarningHistoryEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  user_id: string

  @Property({ columnType: USD_AMOUNT_TYPE })
  amount: number

  @Enum(() => EarningTypeEnum)
  type: EarningTypeEnum
}
