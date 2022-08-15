import { Entity } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'

@Entity({ tableName: 'message' })
export class MessageEntity extends BaseEntity {}
