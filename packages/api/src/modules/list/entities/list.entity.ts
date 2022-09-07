import { Entity, Enum, Index, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { LIST_NAME_LENGTH } from '../constants/schema'
import { ListTypeEnum } from '../enum/list.type.enum'

@Entity({ tableName: 'list' })
@Index({ properties: ['createdAt'] })
export class ListEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity

  @Property({ length: LIST_NAME_LENGTH })
  name: string

  @Enum({ type: () => ListTypeEnum, default: ListTypeEnum.NORMAL })
  type: ListTypeEnum

  @Property({ default: 0 })
  count: number
}
