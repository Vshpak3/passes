import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v4 } from 'uuid'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../../database/database.decorator'
import { DatabaseService } from '../../../database/database.service'
import { OAuthProvider } from '../../auth/helpers/oauth-provider.type'
import { EmailService } from '../../email/email.service'
import { VerifyEmailRequestEntity } from '../../email/entities/verify-email-request.entity'
import { CONFIRM_EMAIL_TEMPLATE } from '../../email/templates/confirm-email'
import { UserDto } from '../../user/dto/user.dto'
import { UserEntity } from '../../user/entities/user.entity'
import { UserService } from '../../user/user.service'
import {
  VERIFY_EMAIL_LIFETIME_MS,
  VERIFY_EMAIL_SUBJECT,
} from '../constants/email'
import { CreateUserRequestDto } from '../dto/create-user.dto'
import { VerifyEmailDto } from '../dto/verify-email.dto'
import { AuthEntity } from '../entities/auth.entity'
import { AuthRecord } from './auth-record'

@Injectable()
export class AuthService {
  private env: string
  private clientUrl: string

  constructor(
    private readonly configService: ConfigService,
    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {
    this.env = this.configService.get('infra.env') as string
    this.clientUrl = this.configService.get('clientUrl') as string
  }

  async setEmail(authId: string, email: string): Promise<void> {
    // TODO: rate limit this endpoint since it effectively allows someone
    // to send an email from our server

    const authRecord = await this.dbReader(AuthEntity.table)
      .where({ id: authId })
      .select('is_email_verified')
      .first()

    // Block endpoint if verified. Do not block if only the email is set
    // (since the user may have entered the wrong email)
    if (authRecord.is_email_verified) {
      throw new BadRequestException('Email already verified')
    }

    await this.dbWriter(AuthEntity.table)
      .update(AuthEntity.toDict<AuthEntity>({ email: email }))
      .where({ id: authId })

    await this.sendVerifyEmailForUserSignin(authId, email)
  }

  async sendVerifyEmailForUserSignin(authId: string, email: string) {
    const id = v4()

    await this.dbWriter(VerifyEmailRequestEntity.table).insert(
      VerifyEmailRequestEntity.toDict<VerifyEmailRequestEntity>({
        id,
        auth: authId,
        email,
      }),
    )

    // Skip sending verifications emails in local development
    if (this.env === 'dev' || this.env === 'stage') {
      return
    }

    const verificationLink = `${this.clientUrl}/email/verify?id=${id}`
    await this.emailService.sendRenderedEmail(
      email,
      VERIFY_EMAIL_SUBJECT,
      CONFIRM_EMAIL_TEMPLATE,
      { email, verifyEmailUrl: verificationLink },
    )
  }

  async verifyEmailForUserSignin(
    authId: string,
    verifyEmailDto: VerifyEmailDto,
  ): Promise<AuthRecord> {
    let request = await this.dbReader(VerifyEmailRequestEntity.table)
      .where({ id: verifyEmailDto.verificationToken })
      .select('*')
      .first()

    // In local development we don't send verification emails and we cannot
    // easily retrive the verification id, so we just grab the last created
    // entry
    if (this.env === 'dev') {
      request = await this.dbReader(VerifyEmailRequestEntity.table)
        .select('*')
        .orderBy('created_at', 'desc')
        .limit(1)
        .first()
    }

    if (!request) {
      throw new BadRequestException('Verify email request does not exist')
    }

    if (
      new Date().getTime() - new Date(request.created_at).getTime() >
      VERIFY_EMAIL_LIFETIME_MS
    ) {
      throw new BadRequestException('Verify email request has expired')
    }

    if (request.used_at) {
      throw new BadRequestException(
        'Verify email request has already been used',
      )
    }

    // Handles deduplicating users based on email
    const user = await this.dbReader(UserEntity.table)
      .where(UserEntity.toDict<UserEntity>({ email: request.email }))
      .select('*')
      .first()

    const authRecordUpdate = { isEmailVerified: true }
    if (user) {
      authRecordUpdate['user'] = user.id
    }

    await this.dbWriter.transaction(async (trx) => {
      await trx(VerifyEmailRequestEntity.table)
        .update(
          VerifyEmailRequestEntity.toDict<VerifyEmailRequestEntity>({
            usedAt: new Date(),
          }),
        )
        .where({ id: request.id })

      await trx(AuthEntity.table)
        .update(AuthEntity.toDict<AuthEntity>(authRecordUpdate))
        .where({ id: authId })
    })

    if (user) {
      return AuthRecord.fromUserDto(new UserDto(user))
    } else {
      return new AuthRecord({ id: authId, isEmailVerified: true })
    }
  }

  async createUser(
    authId: string,
    createUserRequestDto: CreateUserRequestDto,
  ): Promise<AuthRecord> {
    const authRecord = await this.dbReader(AuthEntity.table)
      .where({ id: authId })
      .select(['user_id', 'is_email_verified', 'email'])
      .first()

    if (authRecord.user_id) {
      throw new BadRequestException('Auth is already associated with a user')
    }

    if (!authRecord.is_email_verified) {
      throw new BadRequestException('Email is not verified')
    }

    const user = await this.userService.createUser(
      authId,
      authRecord.email,
      createUserRequestDto,
    )

    return AuthRecord.fromUserDto(user)
  }

  async getAuthRecordFromAuthOrUser(authEntity: any): Promise<AuthRecord> {
    // Auth table has user ID and therefore we have a fully verified user
    if (authEntity.user_id) {
      return AuthRecord.fromUserDto(
        await this.userService.findOne(authEntity.user_id),
      )
    }
    // No user ID and therefore no user entity exists yet
    else {
      return new AuthRecord({
        id: authEntity.id,
        isEmailVerified: authEntity.is_email_verified,
      })
    }
  }

  async findOrCreateOAuthRecord(
    oauthProvider: OAuthProvider,
    oauthId: string,
    email?: string,
  ): Promise<AuthRecord> {
    const authRecord = await this.dbReader(AuthEntity.table)
      .where(AuthEntity.toDict<AuthEntity>({ oauthId, oauthProvider }))
      .select(['id', 'user_id', 'is_email_verified'])
      .first()

    if (authRecord) {
      return this.getAuthRecordFromAuthOrUser(authRecord)
    }

    const id = v4()
    await this.dbWriter(AuthEntity.table).insert(
      AuthEntity.toDict<AuthEntity>({
        id,
        oauthProvider: oauthProvider,
        oauthId: oauthId,
        email: email,
        // If we received an email from OAuth we mark it verified
        isEmailVerified: !!email,
      }),
    )

    return new AuthRecord({ id: id, isEmailVerified: !!email })
  }
}
