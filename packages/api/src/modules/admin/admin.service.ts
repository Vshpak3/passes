import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createTokens } from '../../util/auth.util'
import { AccessTokensResponseDto } from '../auth/dto/access-tokens-dto'
import { AuthRecordDto } from '../auth/dto/auth-record-dto'
import { JwtAuthService } from '../auth/jwt/jwt-auth.service'
import { JwtRefreshService } from '../auth/jwt/jwt-refresh.service'
import { PassEntity } from '../pass/entities/pass.entity'
import { PassHolderEntity } from '../pass/entities/pass-holder.entity'
import { UserExternalPassEntity } from '../pass/entities/user-external-pass.entity'
import { PassTypeEnum } from '../pass/enum/pass.enum'
import { CreatorFeeEntity } from '../payment/entities/creator-fee.entity'
import { S3ContentService } from '../s3content/s3content.service'
import { UserDto } from '../user/dto/user.dto'
import { UserEntity } from '../user/entities/user.entity'
import { UserService } from '../user/user.service'
import { ChainEnum } from '../wallet/enum/chain.enum'
import { CreateExternalPassRequestDto } from './dto/create-external-pass.dto'
import { CreatorFeeDto } from './dto/creator-fee.dto'
import { ExternalPassAddressRequestDto } from './dto/external-pass-address.dto'
import { GetCreatorFeeRequestDto } from './dto/get-creator-fee.dto'
import { UpdateExternalPassRequestDto } from './dto/update-external-pass.dto'
import { UserExternalPassRequestDto } from './dto/user-external-pass.dto'

const ADMIN_EMAIL = '@passes.com'

@Injectable()
export class AdminService {
  private secret: string

  constructor(
    private readonly configService: ConfigService,
    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
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
  ): Promise<AccessTokensResponseDto> {
    return await createTokens(
      res,
      AuthRecordDto.fromUserDto(await this.findUser(userId, username)),
      this.jwtAuthService,
      this.jwtRefreshService,
      this.s3contentService,
    )
  }

  async makeAdult(userId?: string, username?: string): Promise<void> {
    if (!userId) {
      userId = (await this.findUser(userId, username)).id
    }

    await this.userService.makeAdult(userId)
  }

  async addExternalPass(
    createPassDto: CreateExternalPassRequestDto,
  ): Promise<boolean> {
    await this.dbWriter(PassEntity.table).insert(
      PassEntity.toDict<PassEntity>({
        type: PassTypeEnum.EXTERNAL,
        freetrial: false,
        totalSupply: 0,
        title: createPassDto.title,
        description: createPassDto.description,
      }),
    )
    return true
  }

  async updateExternalPass(
    updatePassDto: UpdateExternalPassRequestDto,
  ): Promise<boolean> {
    const updated = await this.dbWriter(PassEntity.table)
      .update(
        PassEntity.toDict<PassEntity>({
          title: updatePassDto.title,
          description: updatePassDto.description,
        }),
      )
      .where(
        PassEntity.toDict<PassEntity>({
          id: updatePassDto.passId,
          type: PassTypeEnum.EXTERNAL,
        }),
      )
    return updated === 1
  }

  async deleteExternalPass(passId: string): Promise<boolean> {
    const updated = await this.dbWriter(PassEntity.table)
      .where(
        PassEntity.toDict<PassEntity>({
          id: passId,
          type: PassTypeEnum.EXTERNAL,
        }),
      )
      .delete()
    return updated === 1
  }

  async addExternalPassAddress(
    addressRequestDto: ExternalPassAddressRequestDto,
  ): Promise<boolean> {
    switch (addressRequestDto.chain) {
      case ChainEnum.ETH:
        await this.dbWriter(PassEntity.table)
          .where(
            PassEntity.toDict<PassEntity>({
              id: addressRequestDto.passId,
              type: PassTypeEnum.EXTERNAL,
            }),
          )
          .update('eth_address', addressRequestDto.address.toLowerCase())
        break
      case ChainEnum.SOL:
        await this.dbWriter(PassHolderEntity.table).insert(
          PassHolderEntity.toDict<PassHolderEntity>({
            pass: addressRequestDto.passId,
            address: addressRequestDto.address,
            chain: ChainEnum.SOL,
          }),
        )
        break
    }
    return true
  }

  async deleteExternalPassAddress(
    addressRequestDto: ExternalPassAddressRequestDto,
  ): Promise<boolean> {
    switch (addressRequestDto.chain) {
      case ChainEnum.ETH:
        await this.dbWriter(PassEntity.table)
          .where(
            PassEntity.toDict<PassEntity>({
              id: addressRequestDto.passId,
              type: PassTypeEnum.EXTERNAL,
              ethAddress: addressRequestDto.address.toLowerCase(),
            }),
          )
          .update('eth_address', null)
        break
      case ChainEnum.SOL:
        await this.dbWriter(PassHolderEntity.table)
          .where(
            PassHolderEntity.toDict<PassHolderEntity>({
              pass: addressRequestDto.passId,
              address: addressRequestDto.address,
              chain: ChainEnum.SOL,
            }),
          )
          .delete()
        break
    }
    return true
  }

  async getCreatorFee(getCreatorFeeRequestDto: GetCreatorFeeRequestDto) {
    return new CreatorFeeDto(
      await this.dbReader(CreatorFeeEntity.table)
        .where('creator_id', getCreatorFeeRequestDto.creatorId)
        .select('*')
        .first(),
    )
  }
  async setCreatorFee(creatorFeeDto: CreatorFeeDto) {
    await this.dbWriter(CreatorFeeEntity.table)
      .insert(
        CreatorFeeEntity.toDict<CreatorFeeEntity>({
          creator: creatorFeeDto.creatorId,
          fiatRate: creatorFeeDto.fiatFlat,
          fiatFlat: creatorFeeDto.fiatFlat,
          cryptoRate: creatorFeeDto.cryptoRate,
          cryptoFlat: creatorFeeDto.cryptoFlat,
        }),
      )
      .onConflict('creator_id')
      .merge(['fiat_rate', 'fiat_flat', 'crypto_rate', 'crypto_flat'])
    return true
  }

  async addUserExternalPass(
    userExternalPassRequestDto: UserExternalPassRequestDto,
  ) {
    const { userId, passId } = userExternalPassRequestDto
    const user = await this.dbReader(UserEntity.table)
      .where('id', userId)
      .select('is_creator')
      .first()
    const pass = await this.dbReader(PassEntity.table)
      .where('id', passId)
      .select('creator_id')
      .first()
    if (!user || !pass || !user.is_creator || pass.creator_id) {
      return false
    }
    await this.dbWriter(UserExternalPassEntity.table).insert(
      UserExternalPassEntity.toDict<UserExternalPassEntity>({
        user: userId,
        pass: passId,
      }),
    )
    return true
  }

  async deleteUserExternalPass(
    userExternalPassRequestDto: UserExternalPassRequestDto,
  ) {
    const { userId, passId } = userExternalPassRequestDto
    const updated = await this.dbWriter(UserExternalPassEntity.table)
      .where(
        UserExternalPassEntity.toDict<UserExternalPassEntity>({
          user: userId,
          pass: passId,
        }),
      )
      .delete()
    return updated === 1
  }
}
