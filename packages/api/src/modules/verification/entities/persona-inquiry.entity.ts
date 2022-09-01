import { Entity, Enum, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PERSONA_ID_LENGTH } from '../constants/schema'
import { KYCStatusEnum } from '../enum/kyc.status.enum'
import { PersonaInquiryStatusEnum } from '../enum/persona-inquiry.status.enum'

@Entity({ tableName: 'persona_inquiry' })
export class PersonaInquiryEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  user: UserEntity

  @Unique()
  @Property({ length: PERSONA_ID_LENGTH })
  personaId: string

  @Enum(() => PersonaInquiryStatusEnum)
  personaStatus: PersonaInquiryStatusEnum

  @Enum({ type: () => KYCStatusEnum, default: KYCStatusEnum.PENDING })
  kycStatus: KYCStatusEnum
}
