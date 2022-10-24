import { Entity, Index, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { ListEntity } from './list.entity'

@Entity()
@Unique({ properties: ['list_id', 'user_id'] })
@Index({ properties: ['created_at'] })
export class ListMemberEntity extends BaseEntity {
  static table = 'list_member'

  @ManyToOne({ entity: () => ListEntity })
  list_id: string

  @ManyToOne({ entity: () => UserEntity })
  user_id: string

  @Property()
  meta_number: number | null
}
