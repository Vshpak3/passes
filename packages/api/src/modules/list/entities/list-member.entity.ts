import { Entity, ManyToOne, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { ListEntity } from './list.entity'

@Entity({ tableName: 'list_member' })
@Unique({ properties: ['list', 'user'] })
export class ListMemberEntity extends BaseEntity {
  @ManyToOne({ onDelete: 'cascade' })
  list: ListEntity

  @ManyToOne()
  user: UserEntity
}
