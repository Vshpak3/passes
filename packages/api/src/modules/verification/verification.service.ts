import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { v4 } from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { ContentFormatEnum } from '../content/enums/content-format.enum'
import { ProfileEntity } from '../profile/entities/profile.entity'
import { S3ContentService } from '../s3content/s3content.service'
import { UserEntity } from '../user/entities/user.entity'
import { UserService } from '../user/user.service'
import { GetCreatorVerificationStepResponseDto } from './dto/get-creator-verification-step.dto'
import { SubmitCreatorVerificationStepRequestDto } from './dto/submit-creator-verification-step.dto'
import { SubmitPersonaInquiryRequestDto } from './dto/submit-persona-inquiry.dto'
import { CreatorVerificationEntity } from './entities/creator-verification.entity'
import { PersonaInquiryEntity } from './entities/persona-inquiry.entity'
import { PersonaVerificationEntity } from './entities/persona-verification.entity'
import { CreatorVerificationStepEnum } from './enum/creator-verification.enum'
import { KYCStatusEnum } from './enum/kyc.status.enum'
import { PersonaInquiryStatusEnum } from './enum/persona-inquiry.status.enum'
import { PersonaVerificationStatusEnum } from './enum/persona-verification.status.enum'
import {
  IncorrectVerificationStepError,
  PersonaVerificationError,
  VerificationError,
} from './error/verification.error'
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

    private readonly userService: UserService,
    private readonly s3ContentService: S3ContentService,
  ) {
    this.personaConnector = new PersonaConnector(this.configService)
  }

  async canSubmitPersona(userId: string) {
    const count = await this.dbReader
      .table(PersonaInquiryEntity.table)
      .where('user_id', userId)
      .count()
    return parseInt(count[0]['count(*)']) < MAX_VERIFICATION_ATTEMPTS
  }

  async submitPersonaInquiry(
    userId: string,
    submitInquiryRequest: SubmitPersonaInquiryRequestDto,
  ) {
    if (!(await this.canSubmitPersona(userId))) {
      throw new PersonaVerificationError(
        'user has exceeded max verification attempts',
      )
    }
    // currently only deal with completed inquiries
    // if persona says that the inquiry is not completed, they have to go through the flow again
    if (
      submitInquiryRequest.personaStatus !== PersonaInquiryStatusEnum.COMPLETED
    ) {
      throw new PersonaVerificationError('inquiry is not completed')
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

  async refreshPersonaVerifications(userId?: string) {
    let query = this.dbReader(PersonaInquiryEntity.table)
      .where('kyc_status', KYCStatusEnum.PENDING)
      .select(['id', 'user_id'])

    if (userId) {
      query = query.andWhere('user_id', userId)
    }
    const inquiries = await query
    await Promise.all(
      inquiries.map(async (inquiry) => {
        try {
          await this.refreshPersonaVerification(inquiry.id, inquiry.user_id)
        } catch (err) {
          this.logger.error(`Error updating inquiry ${inquiry.id}`, err)
        }
      }),
    )
  }

  async refreshPersonaVerification(inquiryId: string, userId: string) {
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

  async submitCreatorVerificationStep(
    userId: string,
    submitCreatorVerificationStepRequestDto: SubmitCreatorVerificationStepRequestDto,
  ): Promise<GetCreatorVerificationStepResponseDto> {
    const creatorVerification = await this.dbReader(
      CreatorVerificationEntity.table,
    )
      .where(
        CreatorVerificationEntity.toDict<CreatorVerificationEntity>({
          user: userId,
          step: submitCreatorVerificationStepRequestDto.step,
        }),
      )
      .select('id')
      .first()
    if (!creatorVerification) {
      throw new IncorrectVerificationStepError(
        `user ${userId} is not on step ${submitCreatorVerificationStepRequestDto.step}`,
      )
    }

    const user = await this.dbReader(UserEntity.table)
      .where('id', userId)
      .select(['is_kycverified', 'is_creator'])
      .first()
    const profile = await this.dbReader(ProfileEntity.table)
      .where('user_id', userId)
      .select('*')
      .first()
    switch (submitCreatorVerificationStepRequestDto.step) {
      case CreatorVerificationStepEnum.STEP_1_PROFILE:
        if (
          !profile.description ||
          !(
            profile.instagram_url ||
            profile.youtube_url ||
            profile.discord_url ||
            profile.twitch_url
          ) ||
          !(await this.s3ContentService.doesObjectExist(
            `profile/upload/${userId}/profile.${ContentFormatEnum.IMAGE}`,
          )) ||
          !(await this.s3ContentService.doesObjectExist(
            `profile/upload/${userId}/banner.${ContentFormatEnum.IMAGE}`,
          ))
        ) {
          throw new VerificationError('user has not finished profile')
        }
        await this.dbWriter(CreatorVerificationEntity.table)
          .where('id', creatorVerification.id)
          .update('step', CreatorVerificationStepEnum.STEP_2_KYC)
        return { step: CreatorVerificationStepEnum.STEP_2_KYC }
      case CreatorVerificationStepEnum.STEP_2_KYC:
        if (!user.is_kycverified) {
          throw new VerificationError('user is not kyc verified yet')
        }
        await this.dbWriter(CreatorVerificationEntity.table)
          .where('id', creatorVerification.id)
          .update('step', CreatorVerificationStepEnum.STEP_3_PAYOUT)
        return { step: CreatorVerificationStepEnum.STEP_3_PAYOUT }
      case CreatorVerificationStepEnum.STEP_3_PAYOUT: // payment information not required
        if (
          !(await this.s3ContentService.doesObjectExist(
            `w9/${userId}/upload.pdf`,
          ))
        ) {
          throw new VerificationError('user has not submitted w9')
        }
        await this.dbWriter(CreatorVerificationEntity.table)
          .where('id', creatorVerification.id)
          .update('step', CreatorVerificationStepEnum.STEP_4_DONE)
        return { step: CreatorVerificationStepEnum.STEP_4_DONE }
      case CreatorVerificationStepEnum.STEP_4_DONE:
        await this.dbWriter(CreatorVerificationEntity.table)
          .where('id', creatorVerification.id)
          .update('step', CreatorVerificationStepEnum.STEP_4_DONE)
        if (!user.is_creator) {
          await this.userService.makeCreator(userId)
        }
        return { step: CreatorVerificationStepEnum.STEP_4_DONE }
      default:
        throw new VerificationError('invalid verification step')
    }
  }

  async getCreatorVerificationStep(
    userId: string,
  ): Promise<GetCreatorVerificationStepResponseDto> {
    const creatorVerification = await this.dbReader(
      CreatorVerificationEntity.table,
    )
      .where(
        CreatorVerificationEntity.toDict<CreatorVerificationEntity>({
          user: userId,
        }),
      )
      .select('step')
      .first()
    if (!creatorVerification) {
      await this.dbWriter(CreatorVerificationEntity.table).insert({
        user: userId,
      })
      return { step: CreatorVerificationStepEnum.STEP_1_PROFILE }
    }
    return { step: creatorVerification.step }
  }
}
