import { EntityManager } from '@mikro-orm/mysql'
import { ConflictException, Injectable } from '@nestjs/common'
import bcrypt from 'bcrypt'
import * as uuid from 'uuid'

import { GetUserDto } from '../../user/dto/get-user.dto'
import { CreateLocalUserDto } from '../dto/create-local-user'
import { BCRYPT_SALT_ROUNDS } from './local.constants'

@Injectable()
export class LocalAuthService {
  constructor(private readonly em: EntityManager) {}

  async createLocalUser(createLocalUserDto: CreateLocalUserDto) {
    const knex = this.em.getKnex()
    const currentUser = await knex('users')
      .where('email', createLocalUserDto.email)
      .first()

    if (currentUser) {
      throw new ConflictException('User already exists with this email')
    }

    const now = new Date()
    const userId = uuid.v4()
    const passwordHash = await bcrypt.hash(
      createLocalUserDto.password,
      BCRYPT_SALT_ROUNDS,
    )

    await knex('users').insert(
      {
        id: userId,
        email: createLocalUserDto.email,
        password_hash: passwordHash,
        // TODO: Generate default usernames
        user_name: createLocalUserDto.email,
        created_at: now,
        updated_at: now,
      },
      '*',
    )
  }

  async validateLocalUser(email: string, password: string) {
    const knex = this.em.getKnex()
    const user: GetUserDto & { password_hash: string } = await knex('users')
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
