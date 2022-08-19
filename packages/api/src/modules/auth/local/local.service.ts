import { ConflictException, Injectable } from '@nestjs/common'
import bcrypt from 'bcrypt'
import { generateFromEmail } from 'unique-username-generator'

import { Database } from '../../../database/database.decorator'
import { DatabaseService } from '../../../database/database.service'
import { MetricsService } from '../../../monitoring/metrics/metric.service'
import { UserEntity } from '../../user/entities/user.entity'
import { CreateLocalUserDto } from '../dto/create-local-user'
import { BCRYPT_SALT_ROUNDS } from './local.constants'

@Injectable()
export class LocalAuthService {
  constructor(
    private readonly metrics: MetricsService,
    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],
  ) {}

  async createLocalUser(createLocalUserDto: CreateLocalUserDto) {
    const currentUser = await this.dbReader(UserEntity.table)
      .where('email', createLocalUserDto.email)
      .where('oauth_provider', null)
      .first()

    if (currentUser) {
      throw new ConflictException('User already exists with this email')
    }

    const passwordHash = await bcrypt.hash(
      createLocalUserDto.password,
      BCRYPT_SALT_ROUNDS,
    )

    await this.dbWriter(UserEntity.table).insert(
      {
        email: createLocalUserDto.email,
        password_hash: passwordHash,
        username: generateFromEmail(createLocalUserDto.email, 3),
        is_kycverified: false,
        is_creator: false,
        is_disabled: false,
      },
      '*',
    )
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
}
