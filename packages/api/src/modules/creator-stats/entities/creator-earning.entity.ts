import { Entity, Enum, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { USD_AMOUNT_TYPE } from '../../payment/constants/schema'
import { UserEntity } from '../../user/entities/user.entity'
import { EarningCategoryEnum } from '../enum/earning.category.enum'
import { EarningTypeEnum } from '../enum/earning.type.enum'

@Entity()
@Unique({ properties: ['user_id', 'type', 'category'] })
export class CreatorEarningEntity extends BaseEntity {
  static table = 'creator_earning'

  @ManyToOne({ entity: () => UserEntity })
  user_id: string

  @Property({ columnType: USD_AMOUNT_TYPE })
  amount: number

  @Enum(() => EarningTypeEnum)
  type: EarningTypeEnum

  @Enum(() => EarningCategoryEnum)
  category: EarningCategoryEnum
}
