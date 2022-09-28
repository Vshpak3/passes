import { Entity, Enum, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PERSONA_ID_LENGTH } from '../constants/schema'
import { KYCStatusEnum } from '../enum/kyc.status.enum'
import { PersonaInquiryStatusEnum } from '../enum/persona-inquiry.status.enum'

@Entity({ tableName: 'persona_inquiry' })
export class PersonaInquiryEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  user_id: string

  @Unique()
  @Property({ length: PERSONA_ID_LENGTH })
  persona_id: string

  @Enum(() => PersonaInquiryStatusEnum)
  persona_status: PersonaInquiryStatusEnum

  @Enum({ type: () => KYCStatusEnum, default: KYCStatusEnum.PENDING })
  kyc_status: KYCStatusEnum
}
