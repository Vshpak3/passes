import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectRedis, Redis } from '@nestjs-modules/ioredis'
import base58 from 'bs58'
import dedent from 'dedent'
import nacl from 'tweetnacl'
import * as uuid from 'uuid'
import Web3 from 'web3'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { LambdaService } from '../lambda/lambda.service'
import { UserEntity } from '../user/entities/user.entity'
import { AuthWalletRequestDto } from './dto/auth-wallet-request.dto'
import { AuthWalletResponseDto } from './dto/auth-wallet-response.dto'
import {
  CreateUnauthenticatedWalletDto,
  CreateWalletDto,
} from './dto/create-wallet.dto'
import { WalletEntity } from './entities/wallet.entity'
import { Chain } from './enum/chain.enum'

export const WALLET_AUTH_MESSAGE_TTL = 300_000 // wallet auth messages live in redis for 5 minutes
export const MAX_WALLETS_PER_USER = 10

@Injectable()
export class WalletService {
  web3: Web3
  constructor(
    private readonly lambdaService: LambdaService,
    @InjectRepository(WalletEntity, 'ReadWrite')
    private readonly walletRepository: EntityRepository<WalletEntity>,
    @InjectRepository(UserEntity, 'ReadWrite')
    private readonly userRepository: EntityRepository<UserEntity>,
    @Database('ReadWrite')
    private readonly ReadWriteDatabaseService: DatabaseService,
    @Database('ReadOnly')
    private readonly ReadOnlyDatabaseService: DatabaseService,
    @InjectRedis() private readonly redisService: Redis,
  ) {
    this.web3 = new Web3(
      'https://eth-mainnet.g.alchemy.com/v2/dDJnsm97esWl2C9fFvmuS6pUMKOe6rlM',
    )
  }

  private getRawMessage(walletAddress: string, nonce: string): string {
    return dedent`Click to verify your wallet with Moment

    This request will not trigger a blockchain transaction or cost any gas fees.

    Wallet address:
    ${walletAddress.toLowerCase()}

    Nonce:
    ${nonce}`
  }

  /**
   * get (unique) internally managed wallet for user
   * @param userId
   */
  async getUserCustodialWallet(userId: string): Promise<WalletEntity> {
    const wallet = await this.walletRepository.findOne({
      user: userId,
      custodial: true,
    })
    if (wallet !== null) {
      return wallet
    }

    // create wallet if it does not exist
    const newWallet = new WalletEntity()
    newWallet.user = this.userRepository.getReference(userId)
    newWallet.address = await this.lambdaService.blockchainSignCreateAddress(
      'user-' + newWallet.id,
    )
    newWallet.chain = Chain.SOL
    newWallet.custodial = true
    this.walletRepository.persistAndFlush(newWallet)
    return newWallet
  }

  async auth(
    userId: string,
    authWalletRequestDto: AuthWalletRequestDto,
  ): Promise<AuthWalletResponseDto> {
    const user = await this.userRepository.getReference(userId)
    const numWallets = (
      await this.walletRepository.find({
        user: user,
      })
    ).length
    if (numWallets >= MAX_WALLETS_PER_USER) {
      throw new BadRequestException(
        `${MAX_WALLETS_PER_USER} wallet limit reached!`,
      )
    }
    let walletAddress = authWalletRequestDto.walletAddress
    if (authWalletRequestDto.chain == Chain.ETH) {
      walletAddress = walletAddress.toLowerCase()
    }
    const userWalletRedisKey = `walletservice.rawMessage.${userId},${walletAddress}}`
    let authMessage = await this.redisService.get(userWalletRedisKey)
    if (authMessage == null) {
      authMessage = this.getRawMessage(walletAddress, uuid.v4())
    }
    await this.redisService.set(
      userWalletRedisKey,
      authMessage,
      'PX',
      WALLET_AUTH_MESSAGE_TTL,
      'NX',
    )
    return {
      rawMessage: authMessage,
      chain: authWalletRequestDto.chain,
      walletAddress: authWalletRequestDto.walletAddress,
    }
  }

  async getWalletsForUser(userId: string): Promise<WalletEntity[]> {
    const user = await this.userRepository.getReference(userId)
    return await this.walletRepository.find({
      user: user,
    })
  }

  async create(
    userId: string,
    createWalletDto: CreateWalletDto,
  ): Promise<WalletEntity> {
    const user = await this.userRepository.getReference(userId)
    const numWallets = (
      await this.walletRepository.find({
        user: user,
      })
    ).length
    if (numWallets >= MAX_WALLETS_PER_USER) {
      throw new BadRequestException(
        `${MAX_WALLETS_PER_USER} wallet limit reached!`,
      )
    }
    let walletAddress = createWalletDto.walletAddress
    if (createWalletDto.chain == Chain.ETH) {
      walletAddress = walletAddress.toLowerCase()
    }
    const wallet = new WalletEntity()
    const userWalletRedisKey = `walletservice.rawMessage.${userId},${walletAddress}`
    wallet.user = user

    const rawMessage = await this.redisService.get(userWalletRedisKey)
    if (rawMessage != createWalletDto.rawMessage) {
      throw new BadRequestException('invalid rawMessage supplied')
    }
    if (createWalletDto.chain == Chain.ETH) {
      const address = this.web3.eth.accounts.recover(
        createWalletDto.rawMessage,
        createWalletDto.signedMessage,
      )
      if (address.toLowerCase() != walletAddress) {
        throw new BadRequestException('recovered address does not match input')
      }
      wallet.address = walletAddress
    } else if (createWalletDto.chain == Chain.SOL) {
      const signatureUint8 = base58.decode(createWalletDto.signedMessage)
      const nonceUint8 = new TextEncoder().encode(createWalletDto.rawMessage)
      const pubKeyUint8 = base58.decode(walletAddress)
      const success = nacl.sign.detached.verify(
        nonceUint8,
        signatureUint8,
        pubKeyUint8,
      )
      if (success) {
        wallet.address = createWalletDto.walletAddress
      } else {
        throw new BadRequestException('invalid message signature for address')
      }
    } else {
      throw new BadRequestException('invalid chain specified')
    }
    const readKnex = this.ReadOnlyDatabaseService.knex
    const existingWallet = (
      await readKnex('wallet').select('*').where('address', walletAddress)
    )[0]
    if (existingWallet == undefined) {
      wallet.chain = createWalletDto.chain
      await this.walletRepository.persistAndFlush(wallet)
      return wallet
    } else {
      return this.updateExistingWalletUser(existingWallet, user)
    }
  }

  async updateExistingWalletUser(
    existingWallet,
    user: UserEntity,
  ): Promise<WalletEntity> {
    if (existingWallet.user_id != null) {
      throw new BadRequestException('invalid wallet address')
    } else {
      const knex = this.ReadWriteDatabaseService.knex
      const now = new Date()
      const knexResult = await knex('wallet')
        .update({ user_id: user.id, updated_at: now })
        .where('id', existingWallet.id)
      if (knexResult != 1) {
        throw new InternalServerErrorException(
          'failed to update existing wallet',
        )
      } else {
        const walletResp = new WalletEntity()
        walletResp.address = existingWallet.address
        walletResp.chain = existingWallet.chain
        walletResp.createdAt = existingWallet.created_at
        walletResp.custodial = existingWallet.custodial
        walletResp.id = existingWallet.id
        walletResp.updatedAt = existingWallet.updated_at
        walletResp.user = user
        return walletResp
      }
    }
  }

  async createUnauthenticated(
    userId: string,
    createUnauthenticatedWalletDto: CreateUnauthenticatedWalletDto,
  ): Promise<void> {
    const { knex, v4 } = this.ReadWriteDatabaseService
    const numWallets = await knex('wallet').where('user_id', userId).count('*')
    if (numWallets[0]['count(*)'] >= MAX_WALLETS_PER_USER) {
      throw new BadRequestException(
        `${MAX_WALLETS_PER_USER} wallet limit reached!`,
      )
    }
    await knex('wallet').insert({
      id: v4(),
      user_id: userId,
      authenticated: false,
      address: createUnauthenticatedWalletDto.walletAddress,
      chain: createUnauthenticatedWalletDto.chain,
    })
  }

  async remove(userId: string, walletId: string): Promise<boolean> {
    const knex = this.ReadWriteDatabaseService.knex
    const knexResult = await knex('wallet')
      .update({ user_id: null })
      .where('id', walletId)
      .where('user_id', userId)
    return knexResult == 1
  }
}
