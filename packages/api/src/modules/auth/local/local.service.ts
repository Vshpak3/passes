import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common'
import bcrypt from 'bcrypt'
import { generateFromEmail } from 'unique-username-generator'
import { v4 } from 'uuid'

import { Database } from '../../../database/database.decorator'
import { DatabaseService } from '../../../database/database.service'
import { MetricsService } from '../../../monitoring/metrics/metric.service'
import { EmailService } from '../../email/email.service'
import { ResetPasswordRequestEntity } from '../../email/entities/reset-password-request.entity'
import { UserEntity } from '../../user/entities/user.entity'
import { CreateLocalUserRequestDto } from '../dto/create-local-user'
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

  async createLocalUser(createLocalUserDto: CreateLocalUserRequestDto) {
    const currentUser = await this.dbReader(UserEntity.table)
      .where('email', createLocalUserDto.email)
      .where('oauth_provider', null)
      .first()

    if (currentUser) {
      throw new ConflictException('User already exists with this email')
    }

    const passwordHash = await this.hashPassword(createLocalUserDto.password)

    const user = new UserEntity().instantiate({
      id: v4(),
      email: createLocalUserDto.email,
      passwordHash: passwordHash,
      username: generateFromEmail(createLocalUserDto.email, 3),
      isKYCVerified: false,
      isCreator: false,
      isDisabled: false,
    })

    await this.dbWriter(UserEntity.table).insert(UserEntity.toDict(user))

    return user
  }

  async validateLocalUser(email: string, password: string) {
    const user: UserEntity & { password_hash: string } = await this.dbReader(
      UserEntity.table,
    )
      .where('email', email)
      .where('oauth_provider', null)
      .first()

    if (!user) {
      this.metrics.increment('login.failure.local')
      return null
    }

    const doesPasswordMatch = await bcrypt.compare(password, user.password_hash)
    if (!doesPasswordMatch) {
      this.metrics.increment('login.failure.local')
      return null
    }

    this.metrics.increment('login.success.local')
    return user
  }

  async updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.dbReader(UserEntity.table)
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
    await this.dbWriter(UserEntity.table)
      .update({ password_hash: passwordHash })
      .where({ id: userId })
  }

  async resetEmailPassword(resetToken: string, newPassword: string) {
    const request = await this.dbReader(ResetPasswordRequestEntity.table)
      .where('id', resetToken)
      .first()

    if (!request) {
      throw new BadRequestException('Reset password request does not exist')
    }

    if (Date.now() < request.expires_at) {
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
