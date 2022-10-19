import { Entity, Enum, Index, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { USD_AMOUNT_TYPE } from '../../payment/constants/schema'
import { UserEntity } from '../../user/entities/user.entity'
import { EarningCategoryEnum } from '../enum/earning.category.enum'
import { EarningTypeEnum } from '../enum/earning.type.enum'

@Entity()
@Index({ properties: ['created_at'] })
export class CreatorEarningHistoryEntity extends BaseEntity {
  static table = 'creator_earning_history'

  @ManyToOne({ entity: () => UserEntity })
  user_id: string

  @Property({ columnType: USD_AMOUNT_TYPE })
  amount: number

  @Enum(() => EarningTypeEnum)
  type: EarningTypeEnum

  @Enum(() => EarningCategoryEnum)
  category: EarningCategoryEnum
}
