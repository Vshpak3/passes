import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PostRequiredPassEntity } from './postrequiredpass.entity'

@Entity({ tableName: 'post' })
export class PostEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity

  @Property({ length: 400 })
  text: string

  @OneToMany(
    () => PostRequiredPassEntity,
    (postRequiredPass) => postRequiredPass.post,
  )
  passesRequired = new Collection<PostRequiredPassEntity>(this)

  @Property({ default: 0 })
  numLikes: number

  @Property({ default: 0 })
  numComments: number

  @Property()
  deletedAt?: Date
}
