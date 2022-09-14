import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import bcrypt from 'bcrypt'
import { v4 } from 'uuid'

import { Database } from '../../../database/database.decorator'
import { DatabaseService } from '../../../database/database.service'
import { MetricsService } from '../../../monitoring/metrics/metric.service'
import { EmailService } from '../../email/email.service'
import { ResetPasswordRequestEntity } from '../../email/entities/reset-password-request.entity'
import { UserEntity } from '../../user/entities/user.entity'
import { AuthRecordDto } from '../dto/auth-record-dto'
import { AuthEntity } from '../entities/auth.entity'
import { BCRYPT_SALT_ROUNDS } from './local.constants'

@Injectable()
export class LocalAuthService {
  constructor(
    private readonly metrics: MetricsService,
    private readonly emailService: EmailService,
    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],
  ) {}

  async createLocalUser(
    email: string,
    password: string,
  ): Promise<AuthRecordDto> {
    const currenAuthRecord = await this.dbReader(AuthEntity.table)
      .where('email', email)
      .where('oauth_provider', null)
      .first()

    if (currenAuthRecord) {
      // TODO (aaronabf): we should avoid leaking account info
      throw new ConflictException('User already exists with this email')
    }

    const id = v4()
    await this.dbReader(AuthEntity.table).insert(
      AuthEntity.toDict<AuthEntity>({
        id,
        email,
        passwordHash: await this.hashPassword(password),
      }),
    )

    return new AuthRecordDto({ id, isEmailVerified: false })
  }

  async validateLocalUser(
    email: string,
    password: string,
  ): Promise<AuthRecordDto> {
    const authRecord = await this.dbReader(AuthEntity.table)
      .where('email', email)
      .where('oauth_provider', null)
      .select(['id', 'is_email_verified', 'password_hash'])
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
    return new AuthRecordDto({
      id: authRecord.id,
      isEmailVerified: authRecord.is_email_verified,
    })
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
      throw new BadRequestException('User is not a email and password user')
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
      .first()

    if (!request) {
      throw new BadRequestException('Reset password request does not exist')
    }

    if (new Date() < request.expires_at) {
      throw new BadRequestException('Reset password request has expired')
    }

    if (request.used_at !== null) {
      throw new BadRequestException(
        'Verify email request has already been used',
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

    await this.emailService.sendConfirmResetPasswordEmail(request.user_id)
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
  }
}
