import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { v4 } from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { UserEntity } from '../user/entities/user.entity'
import { SubmitInquiryRequestDto } from './dto/submit-inquiry.dto'
import { PersonaInquiryEntity } from './entities/persona-inquiry.entity'
import { PersonaVerificationEntity } from './entities/persona-verification.entity'
import { KYCStatusEnum } from './enum/kyc.status.enum'
import { PersonaInquiryStatusEnum } from './enum/persona-inquiry.status.enum'
import { PersonaVerificationStatusEnum } from './enum/persona-verification.status.enum'
import { VerificationError } from './error/verification.error'
import { PersonaConnector } from './persona'

const MAX_VERIFICATION_ATTEMPTS = 3

@Injectable()
export class VerificationService {
  personaConnector: PersonaConnector
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly configService: ConfigService,

    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],
  ) {
    this.personaConnector = new PersonaConnector(this.configService)
  }

  async canSubmit(userId: string) {
    const count = await this.dbReader
      .table(PersonaInquiryEntity.table)
      .where('user_id', userId)
      .count()
    return parseInt(count[0]['count(*)']) < MAX_VERIFICATION_ATTEMPTS
  }

  async submitInquiry(
    userId: string,
    submitInquiryRequest: SubmitInquiryRequestDto,
  ) {
    if (!(await this.canSubmit(userId))) {
      throw new VerificationError('user has exceeded max verification attempts')
    }
    // currently only deal with completed inquiries
    // if persona says that the inquiry is not completed, they have to go through the flow again
    if (
      submitInquiryRequest.personaStatus !== PersonaInquiryStatusEnum.COMPLETED
    ) {
      throw new VerificationError('inquiry is not completed')
    }
    const inquiryData = PersonaInquiryEntity.toDict<PersonaInquiryEntity>({
      id: v4(),
      user: userId,
      personaId: submitInquiryRequest.personaId,
      personaStatus: submitInquiryRequest.personaStatus,
    })
    await this.dbWriter(PersonaInquiryEntity.table).insert(inquiryData)
    const inquiryResponse = await this.personaConnector.getInquiry(
      submitInquiryRequest.personaId,
    )
    const verificationsResponse =
      inquiryResponse.relationships.verifications.data
    await this.dbWriter.transaction(async (trx) => {
      await Promise.all(
        verificationsResponse.map(async (verification) => {
          await trx(PersonaVerificationEntity.table).insert(
            PersonaVerificationEntity.toDict<PersonaVerificationEntity>({
              inquiry: inquiryData.id,
              personaId: verification.id,
            }),
          )
        }),
      )
    })
  }

  async updateVerifications() {
    const inquiries = await this.dbReader(PersonaInquiryEntity.table)
      .where('kyc_status', KYCStatusEnum.PENDING)
      .select(['id', 'user_id'])
    await Promise.all(
      inquiries.map(async (inquiry) => {
        try {
          await this.updateVerification(inquiry.id, inquiry.user_id)
        } catch (e) {
          this.logger.error(`Error updating inquiry ${inquiry.id}`, e)
        }
      }),
    )
  }

  async updateVerification(inquiryId: string, userId: string) {
    const verifications = await this.dbReader(PersonaVerificationEntity.table)
      .where('inquiry_id', inquiryId)
      .select('persona_id')

    // if there were no verifications to be found for inquiry, fail immediately
    if (verifications.length === 0) {
      await this.dbWriter(PersonaInquiryEntity.table)
        .update('kyc_status', KYCStatusEnum.FAILED)
        .where('id', inquiryId)
      return
    }

    const verificationsStatuses = await Promise.all(
      verifications.map(async (verification) => {
        const response = await this.personaConnector.getVerification(
          verification.persona_id,
        )
        return { id: response.id, status: response.attributes.status }
      }),
    )

    // update internal statuses of verifications
    await this.dbWriter.transaction(async (trx) => {
      await Promise.all(
        verificationsStatuses.map(async (verificationStatus) => {
          await trx(PersonaVerificationEntity.table)
            .update(
              PersonaVerificationEntity.toDict<PersonaVerificationEntity>({
                personaStatus: verificationStatus.status,
              }),
            )
            .where('persona_id', verificationStatus.id)
        }),
      )
    })

    const failed = verificationsStatuses.reduce(
      (failed, verificationStatus) => {
        return (
          failed ||
          verificationStatus.status === PersonaVerificationStatusEnum.FAILED ||
          verificationStatus.status ===
            PersonaVerificationStatusEnum.REQUIRES_RETRY ||
          verificationStatus.status === PersonaVerificationStatusEnum.CANCELLED
        )
      },
      false,
    )
    if (failed) {
      await this.dbWriter(PersonaInquiryEntity.table)
        .update('kyc_status', KYCStatusEnum.FAILED)
        .where('id', inquiryId)
      return
    }

    const succeeded = verificationsStatuses.reduce(
      (succeeded, verificationStatus) => {
        return (
          succeeded &&
          verificationStatus.status === PersonaVerificationStatusEnum.PASSED
        )
      },
      true,
    )

    if (succeeded) {
      await this.dbWriter(PersonaInquiryEntity.table)
        .update('kyc_status', KYCStatusEnum.COMPLETED)
        .where('id', inquiryId)
      await this.dbWriter(UserEntity.table)
        .update('is_kycverified', true)
        .where('id', userId)
    }
  }
}
