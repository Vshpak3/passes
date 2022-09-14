import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v4 } from 'uuid'

import { Database } from '../../../database/database.decorator'
import { DatabaseService } from '../../../database/database.service'
import { OAuthProvider } from '../../auth/helpers/oauth-provider.type'
import { VerifyEmailRequestEntity } from '../../email/entities/verify-email-request.entity'
import { UserService } from '../../user/user.service'
import { AuthRecordDto } from '../dto/auth-record-dto'
import { CreateUserRequestDto } from '../dto/create-user.dto'
import { VerifyEmailDto } from '../dto/verify-email.dto'
import { AuthEntity } from '../entities/auth.entity'

@Injectable()
export class AuthService {
  env: string

  constructor(
    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    this.env = this.configService.get('infra.env') as string
  }

  async setEmail(authRecordId: string, email: string): Promise<void> {
    const authRecord = await this.dbReader(AuthEntity.table)
      .where({ id: authRecordId })
      .select('is_email_verified')
      .first()

    // Block endpoint if verified. Do not block if only the email is set
    // (since the user may have entered the wrong email)
    if (authRecord?.is_email_verified) {
      throw new BadRequestException('Email already verified')
    }

    await this.dbWriter(AuthEntity.table)
      .update(AuthEntity.toDict<AuthEntity>({ email: email }))
      .where({ id: authRecordId })
  }

  async verifyEmail(
    authRecordId: string,
    verifyEmailDto: VerifyEmailDto,
  ): Promise<AuthRecordDto> {
    // TODO (aaronabf): add in dedup support

    // Verify all emails automatically in dev
    // TODO (aaronabf): remove staging
    if (this.env === 'dev' || this.env === 'stage') {
      await this.dbWriter(AuthEntity.table)
        .update(AuthEntity.toDict<AuthEntity>({ isEmailVerified: true }))
        .where({ id: authRecordId })
      return new AuthRecordDto({ isEmailVerified: true })
    }

    const request = await this.dbReader(VerifyEmailRequestEntity.table)
      .where({ id: verifyEmailDto.verificationToken })
      .first()

    if (!request) {
      throw new BadRequestException('Verify email request does not exist')
    }

    if (new Date() < request.expires_at) {
      throw new BadRequestException('Verify email request has already expired')
    }

    if (request.used_at !== null) {
      throw new BadRequestException(
        'Verify email request has already been used',
      )
    }

    const data = VerifyEmailRequestEntity.toDict<VerifyEmailRequestEntity>({
      usedAt: new Date(),
    })

    await this.dbWriter.transaction(async (trx) => {
      await trx(VerifyEmailRequestEntity.table)
        .update(data)
        .where({ id: verifyEmailDto.verificationToken })

      await trx(AuthEntity.table)
        .update(AuthEntity.toDict<AuthEntity>({ isEmailVerified: true }))
        .where({ id: authRecordId })
    })

    return new AuthRecordDto({ isEmailVerified: true })
  }

  async createUser(
    authRecordId: string,
    createUserRequestDto: CreateUserRequestDto,
  ): Promise<AuthRecordDto> {
    // TODO (aaronabf): check for duplicate calls

    const authRecord = await this.dbReader(AuthEntity.table)
      .where({ id: authRecordId })
      .select('email')
      .first()

    const user = await this.userService.createUser(
      authRecord.email,
      createUserRequestDto,
    )

    return AuthRecordDto.fromUserDto(user)
  }

  async findOrCreateOAuthRecord(
    oauthProvider: OAuthProvider,
    oauthId: string,
    email?: string,
  ): Promise<AuthRecordDto> {
    const auth = await this.dbReader(AuthEntity.table)
      .where(AuthEntity.toDict<AuthEntity>({ oauthId, oauthProvider }))
      .select('*')
      .first()

    if (auth) {
      // Auth table has user ID and therefore we have a fully verified user
      if (auth.user_id) {
        return AuthRecordDto.fromUserDto(
          await this.userService.findOne(auth.user_id),
        )
      }
      // No user ID and therefore no user entity exists yet
      else {
        return new AuthRecordDto({
          id: auth.id,
          isEmailVerified: auth.is_email_verified,
        })
      }
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

    return new AuthRecordDto({ id: id, isEmailVerified: !!email })
  }
}
