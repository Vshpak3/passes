import { Entity, Enum, OneToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PayinMethodEnum } from '../enum/payin-method.enum'
import { CircleCardEntity } from './circle-card.entity'

@Entity({ tableName: 'default_payin_method' })
export class DefaultPayinMethodEntity extends BaseEntity {
  @OneToOne({ entity: () => UserEntity })
  user_id: string

  @Enum(() => PayinMethodEnum)
  method: PayinMethodEnum

  @OneToOne({ entity: () => CircleCardEntity })
  card_id: string | null

  @Property()
  chain_id: number | null
}
