import { Entity, Enum, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { PERSONA_ID_LENGTH } from '../constants/schema'
import { PersonaVerificationStatusEnum } from '../enum/persona-verification.status.enum'
import { PersonaInquiryEntity } from './persona-inquiry.entity'

@Entity({ tableName: 'persona_verification' })
export class PersonaVerificationEntity extends BaseEntity {
  @ManyToOne({ entity: () => PersonaInquiryEntity })
  inquiry_id: string

  @Unique()
  @Property({ length: PERSONA_ID_LENGTH })
  persona_id: string

  @Enum({
    type: () => PersonaVerificationStatusEnum,
    default: PersonaVerificationStatusEnum.CREATED,
  })
  persona_status: PersonaVerificationStatusEnum
}
