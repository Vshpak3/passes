import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { ContentEntity } from '../../content/entities/content.entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PostRequiredPassEntity } from './postrequiredpass.entity'

@Entity({ tableName: 'post' })
export class PostEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity

  @Property({ length: 400 })
  text: string

  @OneToMany(() => ContentEntity, (content) => content.post)
  content = new Collection<ContentEntity>(this)

  @OneToMany(
    () => PostRequiredPassEntity,
    (postRequiredPass) => postRequiredPass.post,
  )
  passesRequired = new Collection<PostRequiredPassEntity>(this)

  @Property()
  numLikes = 0

  @Property()
  numComments = 0

  @Property()
  deletedAt?: Date
}
