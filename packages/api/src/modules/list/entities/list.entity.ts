import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  OneToOne,
  Property,
  Unique,
} from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { PassEntity } from '../../pass/entities/pass.entity'
import { UserEntity } from '../../user/entities/user.entity'
import { LIST_NAME_LENGTH } from '../constants/schema'
import { ListTypeEnum } from '../enum/list.type.enum'

@Entity({ tableName: 'list' })
@Unique({ properties: ['name', 'type', 'pass'] })
@Index({ properties: ['createdAt'] })
export class ListEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity

  @Property({ length: LIST_NAME_LENGTH })
  name: string

  @Enum({ type: () => ListTypeEnum, default: ListTypeEnum.NORMAL })
  type: ListTypeEnum

  @OneToOne()
  pass?: PassEntity
}
