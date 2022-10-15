import { Entity, Enum, Index, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { LIST_NAME_LENGTH } from '../constants/schema'
import { ListTypeEnum } from '../enum/list.type.enum'

@Entity()
@Index({ properties: ['created_at'] })
export class ListEntity extends BaseEntity {
  static table = 'list'

  @ManyToOne({ entity: () => UserEntity })
  user_id: string

  @Property({ length: LIST_NAME_LENGTH })
  name: string

  @Enum({ type: () => ListTypeEnum, default: ListTypeEnum.NORMAL })
  type: ListTypeEnum

  @Property({ default: 0 })
  count: number

  @Property()
  deleted_at: Date | null
}
