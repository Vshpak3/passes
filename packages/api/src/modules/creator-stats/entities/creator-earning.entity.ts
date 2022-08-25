import {
  Entity,
  Enum,
  ManyToOne,
  Property,
  types,
  Unique,
} from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { EarningTypeEnum } from '../enum/earning.type.enum'

@Entity({ tableName: 'creator_earning' })
@Unique({ properties: ['user', 'type'] })
export class CreatorEarningEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  user: UserEntity

  @Property({ type: types.float })
  amount: number

  @Enum(() => EarningTypeEnum)
  type: EarningTypeEnum
}
