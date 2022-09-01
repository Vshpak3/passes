import { Entity, Enum, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { PERSONA_ID_LENGTH } from '../constants/schema'
import { PersonaVerificationStatusEnum } from '../enum/persona-verification.status.enum'
import { PersonaInquiryEntity } from './persona-inquiry.entity'

@Entity({ tableName: 'persona_verification' })
export class PersonaVerificationEntity extends BaseEntity {
  @ManyToOne({ entity: () => PersonaInquiryEntity })
  inquiry: PersonaInquiryEntity

  @Unique()
  @Property({ length: PERSONA_ID_LENGTH })
  personaId: string

  @Enum({
    type: () => PersonaVerificationStatusEnum,
    default: PersonaVerificationStatusEnum.CREATED,
  })
  personaStatus: PersonaVerificationStatusEnum
}
