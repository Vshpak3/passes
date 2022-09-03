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
import { ListTypeEnum } from '../enum/list.type.enum'

@Entity({ tableName: 'list' })
@Unique({ properties: ['name', 'type', 'pass'] })
@Index({ properties: ['created_at'] })
export class ListEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity

  @Property({ length: 255 })
  name: string

  @Enum({ type: () => ListTypeEnum, default: ListTypeEnum.NORMAL })
  type: ListTypeEnum

  @OneToOne()
  pass?: PassEntity
}
