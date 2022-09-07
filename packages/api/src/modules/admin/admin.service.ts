import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createTokens } from '../../util/auth.util'
import { JwtAuthService } from '../auth/jwt/jwt-auth.service'
import { JwtRefreshService } from '../auth/jwt/jwt-refresh.service'
import { S3ContentService } from '../s3content/s3content.service'
import { UserDto } from '../user/dto/user.dto'
import { UserEntity } from '../user/entities/user.entity'
import { UserService } from '../user/user.service'
import { ImpersonateUserResponseDto } from './dto/impersonate-user.dto'

const ADMIN_EMAIL = '@passes.com'

@Injectable()
export class AdminService {
  private secret: string

  constructor(
    private readonly configService: ConfigService,
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],
    private readonly userService: UserService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly jwtRefreshService: JwtRefreshService,
    private readonly s3contentService: S3ContentService,
  ) {
    this.secret = this.configService.get('admin.impersonate') as string
  }

  async adminCheck(id: string, secret: string): Promise<UserDto> {
    const reqUser = await this.userService.findOne(id)
    if (!reqUser.email.endsWith(ADMIN_EMAIL) || secret !== this.secret) {
      throw new BadRequestException('Invalid request')
    }
    return reqUser
  }

  async findUser(userId?: string, username?: string): Promise<UserDto> {
    if (userId) {
      return await this.userService.findOne(userId)
    } else if (username) {
      return await this.userService.findOneByUsername(username)
    } else {
      throw new BadRequestException('Must provide either a userId or username')
    }
  }

  async impersonateUser(
    res: Response,
    userId?: string,
    username?: string,
  ): Promise<ImpersonateUserResponseDto> {
    const tokens = await createTokens(
      res,
      await this.findUser(userId, username),
      this.jwtAuthService,
      this.jwtRefreshService,
      this.s3contentService,
    )
    return new ImpersonateUserResponseDto(tokens.accessToken)
  }

  async makeAdult(userId?: string, username?: string): Promise<void> {
    if (!userId) {
      userId = (await this.findUser(userId, username)).id
    }

    await this.dbWriter(UserEntity.table)
      .update(UserEntity.toDict<UserEntity>({ isAdult: true }))
      .where({ id: userId })
  }
}
