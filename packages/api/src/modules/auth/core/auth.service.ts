import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
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
import {
  CONFIRM_EMAIL_SUBJECT,
  CONFIRM_EMAIL_TEMPLATE,
  ConfirmEmailTemplateVariables,
} from '../../email/templates/confirm-email'
import { UserDto } from '../../user/dto/user.dto'
import { UserEntity } from '../../user/entities/user.entity'
import { UserService } from '../../user/user.service'
import { VERIFY_EMAIL_LIFETIME_MS } from '../constants/email'
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
    const authRecord = await this.dbReader<AuthEntity>(AuthEntity.table)
      .where({ id: authId })
      .select('is_email_verified')
      .first()

    if (!authRecord) {
      throw new InternalServerErrorException('Unexpected missing auth record')
    }

    // Block endpoint if verified. Do not block if only the email is set
    // (since the user may have entered the wrong email)
    if (authRecord.is_email_verified) {
      throw new BadRequestException('Email already verified')
    }

    await this.dbWriter<AuthEntity>(AuthEntity.table)
      .update({ email: email })
      .where({ id: authId })

    await this.sendVerifyEmailForUserSignin(authId, email)
  }

  async sendVerifyEmailForUserSignin(authId: string, email: string) {
    const id = v4()

    await this.dbWriter<VerifyEmailRequestEntity>(
      VerifyEmailRequestEntity.table,
    ).insert({
      id,
      auth_id: authId,
      email,
    })

    // Skip sending verifications emails in local development
    if (this.env === 'dev') {
      return
    }

    const verificationLink = `${this.clientUrl}/email/verify?id=${id}`
    await this.emailService.sendRenderedEmail(
      email,
      CONFIRM_EMAIL_SUBJECT,
      CONFIRM_EMAIL_TEMPLATE,
      { verifyEmailUrl: verificationLink } as ConfirmEmailTemplateVariables,
    )
  }

  async verifyEmailForUserSignin(
    verifyEmailDto: VerifyEmailDto,
  ): Promise<AuthRecord> {
    let _request = await this.dbReader<VerifyEmailRequestEntity>(
      VerifyEmailRequestEntity.table,
    )
      .where({ id: verifyEmailDto.verificationToken })
      .select('*')
      .first()

    // In local development we don't send verification emails and we cannot
    // easily retrive the verification id, so we just grab the last created
    // entry
    if (this.env === 'dev') {
      _request = await this.dbReader<VerifyEmailRequestEntity>(
        VerifyEmailRequestEntity.table,
      )
        .select('*')
        .orderBy('created_at', 'desc')
        .limit(1)
        .first()
    }

    if (!_request) {
      throw new BadRequestException('Verify email request does not exist')
    }

    const request = _request

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
    const user = await this.dbReader<UserEntity>(UserEntity.table)
      .where({ email: request.email })
      .select('*')
      .first()

    const authRecordUpdate = { is_email_verified: true }
    if (user) {
      authRecordUpdate['user_id'] = user.id
    }

    if (request === undefined) {
      throw new BadRequestException('Verify email request does not exist')
    }

    await this.dbWriter.transaction(async (trx) => {
      await trx<VerifyEmailRequestEntity>(VerifyEmailRequestEntity.table)
        .update({ used_at: new Date() })
        .where({ id: request.id })

      await trx<AuthEntity>(AuthEntity.table)
        .update(authRecordUpdate)
        .where({ id: request.auth_id })
    })

    if (user) {
      return AuthRecord.fromUserDto(new UserDto(user))
    } else {
      return new AuthRecord({ id: request.auth_id, isEmailVerified: true })
    }
  }

  async createUser(
    authId: string,
    createUserRequestDto: CreateUserRequestDto,
  ): Promise<AuthRecord> {
    const authRecord = await this.dbReader<AuthEntity>(AuthEntity.table)
      .where({ id: authId })
      .select(['user_id', 'is_email_verified', 'email'])
      .first()

    if (!authRecord) {
      throw new InternalServerErrorException('Unexpected missing auth record')
    }

    if (authRecord.user_id) {
      throw new BadRequestException('Auth is already associated with a user')
    }

    if (!authRecord.is_email_verified) {
      throw new BadRequestException('Email is not verified')
    }

    const user = await this.userService.createUser(
      authId,
      authRecord.email as string,
      createUserRequestDto,
    )

    return AuthRecord.fromUserDto(user)
  }

  async getAuthRecordFromAuthOrUser(authEntity: any): Promise<AuthRecord> {
    // Auth table has user ID and therefore we have a fully verified user
    if (authEntity.user_id) {
      return AuthRecord.fromUserDto(
        await this.userService.findOne({ id: authEntity.user_id }),
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
    const authRecord = await this.dbReader<AuthEntity>(AuthEntity.table)
      .where({ oauth_id: oauthId, oauth_provider: oauthProvider })
      .select('id', 'user_id', 'is_email_verified')
      .first()

    if (authRecord) {
      return this.getAuthRecordFromAuthOrUser(authRecord)
    }

    // If we received an email from OAuth we mark it verified
    const emailVerified = !!email

    // Handles deduplicating users based on email
    let user: UserDto | undefined = undefined
    if (emailVerified) {
      user = await this.userService.findOne({ email }).catch(() => undefined)
    }

    const id = v4()
    await this.dbWriter<AuthEntity>(AuthEntity.table).insert({
      id,
      oauth_provider: oauthProvider,
      oauth_id: oauthId,
      email,
      is_email_verified: emailVerified,
      user_id: user?.userId,
    })

    if (user) {
      return AuthRecord.fromUserDto(user)
    } else {
      return new AuthRecord({ id: id, isEmailVerified: emailVerified })
    }
  }
}
