import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import bcrypt from 'bcrypt'
import { v4 } from 'uuid'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../../database/database.decorator'
import { DatabaseService } from '../../../database/database.service'
import { MetricsService } from '../../../monitoring/metrics/metric.service'
import { EmailService } from '../../email/email.service'
import { ResetPasswordRequestEntity } from '../../email/entities/reset-password-request.entity'
import { CONFIRM_PASSWORD_RESET_EMAIL } from '../../email/templates/confirm-password-reset'
import { INIT_PASSWORD_RESET_EMAIL_TEMPLATE } from '../../email/templates/init-password-reset'
import { UserEntity } from '../../user/entities/user.entity'
import {
  RESET_PASSWORD_EMAIL_INIT_SUBJECT,
  RESET_PASSWORD_EMAIL_LIFETIME_MS,
  RESET_PASSWORD_EMAIL_SUCCESS_SUBJECT,
} from '../constants/email'
import { AuthService } from '../core/auth.service'
import { AuthRecord } from '../core/auth-record'
import { ConfirmResetPasswordRequestDto } from '../dto/local/confirm-reset-password.dto'
import { CreateLocalUserRequestDto } from '../dto/local/create-local-user.dto'
import { InitResetPasswordRequestDto } from '../dto/local/init-reset-password.dto'
import { LocalUserLoginRequestDto } from '../dto/local/local-user-login.dto'
import { UpdatePasswordRequestDto } from '../dto/local/update-password.dto'
import { AuthEntity } from '../entities/auth.entity'
import { BCRYPT_SALT_ROUNDS } from './local.constants'

@Injectable()
export class LocalAuthService {
  private env: string
  private clientUrl: string

  constructor(
    private readonly configService: ConfigService,
    private readonly metrics: MetricsService,
    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {
    this.env = this.configService.get('infra.env') as string
    this.clientUrl = this.configService.get('clientUrl') as string
  }

  async createLocalUser(
    createLocalUserDto: CreateLocalUserRequestDto,
  ): Promise<AuthRecord> {
    const email = createLocalUserDto.email

    const currenAuthRecord = await this.dbReader(AuthEntity.table)
      .where('email', email)
      .whereNull('oauth_provider')
      .first()

    if (currenAuthRecord) {
      // TODO: we should avoid leaking account info
      throw new ConflictException('User already exists with this email')
    }

    const id = v4()
    await this.dbWriter(AuthEntity.table).insert(
      AuthEntity.toDict<AuthEntity>({
        id,
        email,
        passwordHash: await this.hashPassword(createLocalUserDto.password),
      }),
    )

    await this.authService.sendVerifyEmailForUserSignin(id, email)

    return new AuthRecord({ id, isEmailVerified: false })
  }

  async validateLocalUser(
    userLoginDto: LocalUserLoginRequestDto,
  ): Promise<AuthRecord> {
    const authRecord = await this.dbReader(AuthEntity.table)
      .where('email', userLoginDto.email)
      .whereNull('oauth_provider')
      .select(['id', 'user_id', 'is_email_verified', 'password_hash'])
      .first()

    if (!authRecord) {
      this.metrics.increment('login.failure.local')
      throw new UnauthorizedException('Invalid credentials')
    }

    const doesPasswordMatch = await bcrypt.compare(
      userLoginDto.password,
      authRecord.password_hash,
    )
    if (!doesPasswordMatch) {
      this.metrics.increment('login.failure.local')
      throw new UnauthorizedException('Invalid credentials')
    }

    this.metrics.increment('login.success.local')
    return this.authService.getAuthRecordFromAuthOrUser(authRecord)
  }

  async sendInitResetPasswordEmail(
    initResetPasswordRequestDto: InitResetPasswordRequestDto,
  ): Promise<void> {
    const email = initResetPasswordRequestDto.email

    // This endpoint is unauthed so we must check for the a record
    const authRecord = await this.dbReader(AuthEntity.table)
      .where(AuthEntity.toDict<AuthEntity>({ email }))
      .whereNull('oauth_provider')
      .first()

    if (!authRecord) {
      throw new BadRequestException('User is not configued with password login')
    }

    const id = v4()
    await this.dbWriter(ResetPasswordRequestEntity.table).insert(
      ResetPasswordRequestEntity.toDict<ResetPasswordRequestEntity>({
        id,
        auth: authRecord.id,
        email,
      }),
    )

    // Skip sending password reset emails in local development
    if (this.env === 'dev') {
      return
    }

    const passwordResetLink = `${this.clientUrl}/reset-password?token=${id}`
    await this.emailService.sendRenderedEmail(
      email,
      RESET_PASSWORD_EMAIL_INIT_SUBJECT,
      INIT_PASSWORD_RESET_EMAIL_TEMPLATE,
      { email, passwordResetLink },
    )
  }

  async confirmResetPassword(
    confirmResetPasswordRequestDto: ConfirmResetPasswordRequestDto,
  ): Promise<AuthRecord> {
    let request = await this.dbReader(ResetPasswordRequestEntity.table)
      .where('id', confirmResetPasswordRequestDto.verificationToken)
      .select('*')
      .first()

    // In local development we don't send reset password emails and we cannot
    // easily retrive the reset id, so we just grab the last created
    // entry
    if (this.env === 'dev') {
      request = await this.dbReader(ResetPasswordRequestEntity.table)
        .select('*')
        .orderBy('created_at', 'desc')
        .limit(1)
        .first()
    }

    if (!request) {
      throw new BadRequestException('Reset password request does not exist')
    }

    if (
      new Date().getTime() - new Date(request.created_at).getTime() >
      RESET_PASSWORD_EMAIL_LIFETIME_MS
    ) {
      throw new BadRequestException('Reset password request has expired')
    }

    if (request.used_at) {
      throw new BadRequestException(
        'Reset password request has already been used',
      )
    }

    const email = request.email
    const hashedPassword = await this.hashPassword(
      confirmResetPasswordRequestDto.password,
    )

    const authRecord = await this.dbReader(AuthEntity.table)
      .where(AuthEntity.toDict<AuthEntity>({ email }))
      .whereNull('oauth_provider')
      .first()

    await this.dbWriter.transaction(async (trx) => {
      await trx(ResetPasswordRequestEntity.table)
        .update(
          ResetPasswordRequestEntity.toDict<ResetPasswordRequestEntity>({
            usedAt: new Date(),
          }),
        )
        .where({ id: request.id })

      await trx(AuthEntity.table)
        .where('id', authRecord.id)
        .update(AuthEntity.toDict<AuthEntity>({ passwordHash: hashedPassword }))
    })

    // Skip sending password confirmation emails in local development
    if (this.env !== 'dev') {
      await this.emailService.sendRenderedEmail(
        email,
        RESET_PASSWORD_EMAIL_SUCCESS_SUBJECT,
        CONFIRM_PASSWORD_RESET_EMAIL,
        { email },
      )
    }

    return this.authService.getAuthRecordFromAuthOrUser(authRecord)
  }

  async updatePassword(
    userId: string,
    updatePasswordDto: UpdatePasswordRequestDto,
  ): Promise<void> {
    const user = await this.dbReader(UserEntity.table)
      .where('id', userId)
      .select('email')
      .first()

    // We don't currently index on user_id so look up by email instead
    const authRecord = await this.dbReader(AuthEntity.table)
      .where('email', user.email)
      .whereNull('oauth_provider')
      .select(['id', 'password_hash'])
      .first()

    if (!authRecord) {
      throw new BadRequestException('User is not an email and password user')
    }

    const doesPasswordMatch = await bcrypt.compare(
      updatePasswordDto.oldPassword,
      authRecord.password_hash,
    )
    if (!doesPasswordMatch) {
      throw new BadRequestException('Current password is incorrect')
    }

    const passwordHash = await this.hashPassword(updatePasswordDto.newPassword)
    await this.dbWriter(AuthEntity.table)
      .update(AuthEntity.toDict<AuthEntity>({ passwordHash }))
      .where({ id: authRecord.id })
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
  }
}
