import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import bcrypt from 'bcrypt'
import { v4 } from 'uuid'

import { Database } from '../../../database/database.decorator'
import { DatabaseService } from '../../../database/database.service'
import { MetricsService } from '../../../monitoring/metrics/metric.service'
import { EmailService } from '../../email/email.service'
import { ResetPasswordRequestEntity } from '../../email/entities/reset-password-request.entity'
import { VerifyEmailRequestEntity } from '../../email/entities/verify-email-request.entity'
import { CONFIRM_EMAIL_TEMPLATE } from '../../email/templates/confirm-email'
import { CONFIRM_PASSWORD_RESET_EMAIL } from '../../email/templates/confirm-password-reset'
import { UserEntity } from '../../user/entities/user.entity'
import {
  RESET_EMAIL_SUBJECT,
  RESET_EMAIL_SUCCESS_SUBJECT,
  RESET_PASSWORD_EMAIL_LIFETIME_MS,
} from '../constants/email'
import { AuthService } from '../core/auth.service'
import { AuthRecord } from '../core/auth-record'
import { AuthEntity } from '../entities/auth.entity'
import { BCRYPT_SALT_ROUNDS } from './local.constants'

@Injectable()
export class LocalAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly metrics: MetricsService,
    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  async createLocalUser(email: string, password: string): Promise<AuthRecord> {
    const currenAuthRecord = await this.dbReader(AuthEntity.table)
      .where('email', email)
      .andWhere('oauth_provider', null)
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
        passwordHash: await this.hashPassword(password),
      }),
    )

    await this.authService.sendVerifyEmailForUserSignin(id, email)

    return new AuthRecord({ id, isEmailVerified: false })
  }

  async validateLocalUser(
    email: string,
    password: string,
  ): Promise<AuthRecord> {
    const authRecord = await this.dbReader(AuthEntity.table)
      .where('email', email)
      .where('oauth_provider', null)
      .select(['id', 'user_id', 'is_email_verified', 'password_hash'])
      .first()

    if (!authRecord) {
      this.metrics.increment('login.failure.local')
      throw new UnauthorizedException('Invalid credentials')
    }

    const doesPasswordMatch = await bcrypt.compare(
      password,
      authRecord.password_hash,
    )
    if (!doesPasswordMatch) {
      this.metrics.increment('login.failure.local')
      throw new UnauthorizedException('Invalid credentials')
    }

    this.metrics.increment('login.success.local')
    return this.authService.getAuthRecordFromAuthOrUser(authRecord)
  }

  async updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.dbReader(AuthEntity.table)
      .where('id', userId)
      .where('oauth_provider', null)
      .first()

    if (!user) {
      throw new BadRequestException('User is not an email and password user')
    }

    const doesPasswordMatch = await bcrypt.compare(
      oldPassword,
      user.password_hash,
    )
    if (!doesPasswordMatch) {
      throw new BadRequestException('Current password is incorrect')
    }

    const passwordHash = await this.hashPassword(newPassword)
    await this.dbWriter(AuthEntity.table)
      .update(AuthEntity.toDict<AuthEntity>({ passwordHash }))
      .where({ id: userId })
  }

  async resetEmailPassword(
    resetToken: string,
    newPassword: string,
  ): Promise<void> {
    const request = await this.dbReader(ResetPasswordRequestEntity.table)
      .where('id', resetToken)
      .select('*')
      .first()

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

    const data = ResetPasswordRequestEntity.toDict<ResetPasswordRequestEntity>({
      usedAt: new Date(),
    })

    const hashedPassword = await this.hashPassword(newPassword)

    await this.dbWriter.transaction(async (trx) => {
      await trx(ResetPasswordRequestEntity.table)
        .update(data)
        .where({ id: resetToken })

      await trx(UserEntity.table)
        .where('id', request.user_id)
        .update('password_hash', hashedPassword)
    })

    await this.sendConfirmResetPasswordEmail(request.user_id)
  }

  async sendInitResetPassword(email: string) {
    // const user = await this.dbReader(UserEntity.table).where({ email }).first()

    // if (!user || user.oauth_provider !== null) {
    //   throw new BadRequestException(USER_NOT_EMAIL)
    // }

    // if (user.is_email_verified) {
    //   throw new BadRequestException(EMAIL_ALREADY_VERIFIED)
    // }

    const id = v4()
    await this.dbWriter(VerifyEmailRequestEntity.table).insert(
      VerifyEmailRequestEntity.toDict<VerifyEmailRequestEntity>({
        id,
        email,
        auth: 'TODO',
      }),
      '*',
    )

    const passwordResetLink = `${this.configService.get(
      'clientUrl',
    )}/password-reset?token=${id}`

    await this.emailService.sendRenderedEmail(
      email,
      RESET_EMAIL_SUBJECT,
      CONFIRM_EMAIL_TEMPLATE,
      { email, passwordResetLink },
    )
  }

  async sendConfirmResetPasswordEmail(userId: string) {
    const user = await this.dbReader(UserEntity.table)
      .where({ id: userId })
      .first()

    // if (!user || user.oauth_provider !== null) {
    //   throw new BadRequestException(USER_NOT_EMAIL)
    // }

    await this.emailService.sendRenderedEmail(
      user.email,
      RESET_EMAIL_SUCCESS_SUBJECT,
      CONFIRM_PASSWORD_RESET_EMAIL,
      { email: user.email, display_name: user.display_name },
    )
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
  }
}
