import { Entity, Enum, OneToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PayinMethodDto } from '../dto/payin-method.dto'
import { PayinMethodEnum } from '../enum/payin.enum'

@Entity({ tableName: 'default_payin_method' })
export class DefaultPayinMethodEntity extends BaseEntity {
  @OneToOne({ entity: () => UserEntity })
  user: UserEntity

  @Property()
  @Unique()
  methodId?: string

  @Enum(() => PayinMethodEnum)
  method: PayinMethodEnum

  dto(): PayinMethodDto {
    return {
      methodId: this.methodId,
      method: this.method,
    }
  }
}
