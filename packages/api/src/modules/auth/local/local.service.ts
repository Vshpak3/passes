import { ConflictException, Injectable } from '@nestjs/common'
import bcrypt from 'bcrypt'
import { generateFromEmail } from 'unique-username-generator'

import { Database } from '../../../database/database.decorator'
import { DatabaseService } from '../../../database/database.service'
import { UserEntity } from '../../user/entities/user.entity'
import { CreateLocalUserDto } from '../dto/create-local-user'
import { BCRYPT_SALT_ROUNDS } from './local.constants'

@Injectable()
export class LocalAuthService {
  constructor(
    @Database('ReadOnly')
    private readonly ReadOnlyDatabaseService: DatabaseService,
    @Database('ReadWrite')
    private readonly ReadWriteDatabaseService: DatabaseService,
  ) {}

  async createLocalUser(createLocalUserDto: CreateLocalUserDto) {
    const knex = this.ReadWriteDatabaseService.knex
    const currentUser = await knex('users')
      .where('email', createLocalUserDto.email)
      .first()

    if (currentUser) {
      throw new ConflictException('User already exists with this email')
    }

    const passwordHash = await bcrypt.hash(
      createLocalUserDto.password,
      BCRYPT_SALT_ROUNDS,
    )

    await knex('users').insert(
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
    const knex = this.ReadOnlyDatabaseService.knex
    const user: UserEntity & { password_hash: string } = await knex('users')
      .where('email', email)
      .first()

    if (!user) {
      return null
    }

    const doesPasswordMatch = await bcrypt.compare(password, user.password_hash)
    if (!doesPasswordMatch) {
      return null
    }

    return user
  }
}
