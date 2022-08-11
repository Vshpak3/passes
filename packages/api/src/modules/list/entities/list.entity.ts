import {
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { ListMemberEntity } from './list-member.entity'

@Entity({ tableName: 'list' })
export class ListEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity

  @Property()
  name: string

  @OneToMany({
    entity: () => ListMemberEntity,
    mappedBy: 'list',
    cascade: [Cascade.REMOVE],
  })
  listMembers = new Collection<ListMemberEntity>(this)
}
