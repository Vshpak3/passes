import { Entity, Enum, ManyToOne, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { EarningTypeEnum } from '../enum/earning.type.enum'

@Entity({ tableName: 'creator_earning_history' })
export class CreatorEarningHistoryEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  user: UserEntity

  @Property({ type: types.float })
  amount: number

  @Enum(() => EarningTypeEnum)
  type: EarningTypeEnum
}
