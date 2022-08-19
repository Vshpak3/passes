import { Entity, Enum, OneToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PayinMethodEnum } from '../enum/payin-method.enum'
import { CircleCardEntity } from './circle-card.entity'

@Entity({ tableName: 'default_payin_method' })
export class DefaultPayinMethodEntity extends BaseEntity {
  @OneToOne({ entity: () => UserEntity })
  user: UserEntity

  @Enum(() => PayinMethodEnum)
  method: PayinMethodEnum

  @OneToOne({ entity: () => CircleCardEntity })
  card?: CircleCardEntity

  @Property()
  chainId?: number
}
