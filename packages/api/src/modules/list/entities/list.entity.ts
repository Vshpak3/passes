import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { LIST_NAME_LENGTH } from '../constants/schema'
import { ListTypeEnum } from '../enum/list.type.enum'

@Entity()
@Index({ properties: ['created_at'] })
@Unique({ properties: ['name', 'user_id'] })
export class ListEntity extends BaseEntity {
  static table = 'list'

  @ManyToOne({ entity: () => UserEntity })
  user_id: string

  @Property({ length: LIST_NAME_LENGTH })
  name: string | null

  @Enum({ default: ListTypeEnum.NORMAL })
  type: ListTypeEnum

  @Property({ default: 0 })
  count: number

  @Property({ length: 3 })
  deleted_at: Date | null
}
