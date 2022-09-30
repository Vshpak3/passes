import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createTokens } from '../../util/auth.util'
import { AuthRecord } from '../auth/core/auth-record'
import { AccessTokensResponseDto } from '../auth/dto/access-tokens-dto'
import { JwtAuthService } from '../auth/jwt/jwt-auth.service'
import { JwtRefreshService } from '../auth/jwt/jwt-refresh.service'
import { PassEntity } from '../pass/entities/pass.entity'
import { PassHolderEntity } from '../pass/entities/pass-holder.entity'
import { UserExternalPassEntity } from '../pass/entities/user-external-pass.entity'
import { PassTypeEnum } from '../pass/enum/pass.enum'
import { CircleChargebackEntity } from '../payment/entities/circle-chargeback.entity'
import { CreatorFeeEntity } from '../payment/entities/creator-fee.entity'
import { PaymentService } from '../payment/payment.service'
import { ProfileService } from '../profile/profile.service'
import { S3ContentService } from '../s3content/s3content.service'
import { UserDto } from '../user/dto/user.dto'
import { UserEntity } from '../user/entities/user.entity'
import { UserService } from '../user/user.service'
import { ChainEnum } from '../wallet/enum/chain.enum'
import { CreateExternalPassRequestDto } from './dto/create-external-pass.dto'
import { CreatorFeeDto } from './dto/creator-fee.dto'
import { ExternalPassAddressRequestDto } from './dto/external-pass-address.dto'
import { GetCreatorFeeRequestDto } from './dto/get-creator-fee.dto'
import { UpdateChargebackRequestDto } from './dto/update-chargeback.dto'
import { UpdateExternalPassRequestDto } from './dto/update-external-pass.dto'
import { UserExternalPassRequestDto } from './dto/user-external-pass.dto'

const ADMIN_EMAIL = '@passes.com'

@Injectable()
export class AdminService {
  private env: string
  private secret: string

  constructor(
    private readonly configService: ConfigService,
    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly jwtRefreshService: JwtRefreshService,
    private readonly s3contentService: S3ContentService,
    private readonly paymentService: PaymentService,
  ) {
    this.secret = this.configService.get('admin.secret') as string
    this.env = this.configService.get('infra.env') as string
  }

  async adminCheck(id: string, secret: string): Promise<UserDto> {
    const reqUser = await this.userService.findOne({ id })
    // Skip admin check in local development
    if (this.env === 'dev') {
      return reqUser
    }
    if (!reqUser.email.endsWith(ADMIN_EMAIL) || secret !== this.secret) {
      throw new BadRequestException('Invalid request')
    }
    return reqUser
  }

  async findUser(userId?: string, username?: string): Promise<UserDto> {
    if (userId) {
      return await this.userService.findOne({ id: userId })
    } else if (username) {
      return await this.userService.findOne({ username })
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
      AuthRecord.fromUserDto(await this.findUser(userId, username)),
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

  async makeCreator(userId?: string, username?: string): Promise<void> {
    if (!userId) {
      userId = (await this.findUser(userId, username)).id
    }

    await this.userService.makeCreator(userId)
    await this.profileService.createOrUpdateProfile(userId, {})
  }

  async addExternalPass(
    createPassDto: CreateExternalPassRequestDto,
  ): Promise<boolean> {
    await this.dbWriter<PassEntity>(PassEntity.table).insert({
      type: PassTypeEnum.EXTERNAL,
      freetrial: false,
      total_supply: 0,
      title: createPassDto.title,
      description: createPassDto.description,
      chain: createPassDto.chain,
    })
    return true
  }

  async updateExternalPass(
    updatePassDto: UpdateExternalPassRequestDto,
  ): Promise<boolean> {
    const updated = await this.dbWriter<PassEntity>(PassEntity.table)
      .update({
        title: updatePassDto.title,
        description: updatePassDto.description,
      })
      .where({
        id: updatePassDto.passId,
        type: PassTypeEnum.EXTERNAL,
      })
    return updated === 1
  }

  async deleteExternalPass(passId: string): Promise<boolean> {
    const updated = await this.dbWriter<PassEntity>(PassEntity.table)
      .where({
        id: passId,
        type: PassTypeEnum.EXTERNAL,
      })
      .delete()
    return updated === 1
  }

  async addExternalPassAddress(
    addressRequestDto: ExternalPassAddressRequestDto,
  ): Promise<boolean> {
    switch (addressRequestDto.chain) {
      case ChainEnum.ETH:
        await this.dbWriter<PassEntity>(PassEntity.table)
          .where({
            id: addressRequestDto.passId,
            type: PassTypeEnum.EXTERNAL,
          })
          .update({
            collection_address: addressRequestDto.address.toLowerCase(),
          })
        break
      case ChainEnum.SOL:
        await this.dbWriter<PassHolderEntity>(PassHolderEntity.table).insert({
          pass_id: addressRequestDto.passId,
          address: addressRequestDto.address,
          chain: ChainEnum.SOL,
        })
        break
    }
    return true
  }

  async deleteExternalPassAddress(
    addressRequestDto: ExternalPassAddressRequestDto,
  ): Promise<boolean> {
    switch (addressRequestDto.chain) {
      case ChainEnum.ETH:
        await this.dbWriter<PassEntity>(PassEntity.table)
          .where({
            id: addressRequestDto.passId,
            type: PassTypeEnum.EXTERNAL,
            collection_address: addressRequestDto.address.toLowerCase(),
            chain: addressRequestDto.chain,
          })
          .update({ collection_address: '' })
        break
      case ChainEnum.SOL:
        await this.dbWriter<PassHolderEntity>(PassHolderEntity.table)
          .where({
            pass_id: addressRequestDto.passId,
            address: addressRequestDto.address,
            chain: ChainEnum.SOL,
          })
          .delete()
        break
    }
    return true
  }

  async getCreatorFee(getCreatorFeeRequestDto: GetCreatorFeeRequestDto) {
    return new CreatorFeeDto(
      await this.dbReader<CreatorFeeEntity>(CreatorFeeEntity.table)
        .where({ creator_id: getCreatorFeeRequestDto.creatorId })
        .select('*')
        .first(),
    )
  }
  async setCreatorFee(creatorFeeDto: CreatorFeeDto) {
    await this.dbWriter<CreatorFeeEntity>(CreatorFeeEntity.table)
      .insert({
        creator_id: creatorFeeDto.creatorId,
        fiat_rate: creatorFeeDto.fiatFlat,
        fiat_flat: creatorFeeDto.fiatFlat,
        crypto_rate: creatorFeeDto.cryptoRate,
        crypto_flat: creatorFeeDto.cryptoFlat,
      })
      .onConflict('creator_id')
      .merge(['fiat_rate', 'fiat_flat', 'crypto_rate', 'crypto_flat'])
    return true
  }

  async addUserExternalPass(
    userExternalPassRequestDto: UserExternalPassRequestDto,
  ) {
    const { userId, passId } = userExternalPassRequestDto
    const user = await this.dbReader<UserEntity>(UserEntity.table)
      .where({ id: userId })
      .select('is_creator')
      .first()
    const pass = await this.dbReader<PassEntity>(PassEntity.table)
      .where({ id: passId })
      .select('creator_id')
      .first()
    if (!user || !pass || !user.is_creator || pass.creator_id) {
      return false
    }
    await this.dbWriter<UserExternalPassEntity>(
      UserExternalPassEntity.table,
    ).insert({
      user_id: userId,
      pass_id: passId,
    })
    return true
  }

  async deleteUserExternalPass(
    userExternalPassRequestDto: UserExternalPassRequestDto,
  ) {
    const { userId, passId } = userExternalPassRequestDto
    const updated = await this.dbWriter<UserExternalPassEntity>(
      UserExternalPassEntity.table,
    )
      .where({
        user_id: userId,
        pass_id: passId,
      })
      .delete()
    return updated === 1
  }

  async getChargebacks() {
    return await this.dbReader<CircleChargebackEntity>(
      CircleChargebackEntity.table,
    )
      .whereNull('disputed')
      .select('*')
  }

  async updateChargeback(
    updateChargebackRequestDto: UpdateChargebackRequestDto,
  ) {
    if (updateChargebackRequestDto.disputed) {
      await this.paymentService.disputedChargeback(
        updateChargebackRequestDto.circleChargebackId,
      )
    } else {
      await this.paymentService.undisputedChargeback(
        updateChargebackRequestDto.circleChargebackId,
      )
    }
  }
}
