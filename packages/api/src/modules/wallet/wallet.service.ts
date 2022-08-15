import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectRedis, Redis } from '@nestjs-modules/ioredis'
import base58 from 'bs58'
import dedent from 'dedent'
import nacl from 'tweetnacl'
import { v4 } from 'uuid'
import Web3 from 'web3'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { LambdaService } from '../lambda/lambda.service'
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
    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],
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
    const wallet = await this.dbReader(WalletEntity.table)
      .where(
        WalletEntity.toDict<WalletEntity>({
          user: userId,
          custodial: true,
        }),
      )
      .first()
    if (wallet !== null) {
      return wallet
    }

    // create wallet if it does not exist
    const id = v4()
    const data = WalletEntity.toDict<WalletEntity>({
      id,
      user: userId,
      address: await this.lambdaService.blockchainSignCreateAddress(
        'user-' + id,
      ),
      chain: Chain.SOL,
      custodial: true,
    })
    await this.dbWriter(WalletEntity.table).insert(data)
    // TODO: fix return type
    return data as any
  }

  async auth(
    userId: string,
    authWalletRequestDto: AuthWalletRequestDto,
  ): Promise<AuthWalletResponseDto> {
    const numWallets = (
      await this.dbReader(WalletEntity.table).where(
        WalletEntity.toDict<WalletEntity>({
          user: userId,
        }),
      )
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
      authMessage = this.getRawMessage(walletAddress, v4())
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
    return await this.dbReader(WalletEntity.table).where(
      WalletEntity.toDict<WalletEntity>({
        user: userId,
      }),
    )
  }

  async create(
    userId: string,
    createWalletDto: CreateWalletDto,
  ): Promise<WalletEntity> {
    const numWallets = (
      await this.dbReader(WalletEntity.table).where(
        WalletEntity.toDict<WalletEntity>({
          user: userId,
        }),
      )
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

    const data = WalletEntity.toDict<WalletEntity>({
      user: userId,
    })
    const userWalletRedisKey = `walletservice.rawMessage.${userId},${walletAddress}`

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
      data.address = walletAddress
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
        data.address = createWalletDto.walletAddress
      } else {
        throw new BadRequestException('invalid message signature for address')
      }
    } else {
      throw new BadRequestException('invalid chain specified')
    }
    const existingWallet = (
      await this.dbReader('wallet').select('*').where('address', walletAddress)
    )[0]
    if (existingWallet == undefined) {
      data.chain = createWalletDto.chain
      await this.dbWriter(WalletEntity.table).insert(data)
      // TODO: fix return type
      return data as any
    } else {
      return this.updateExistingWalletUser(existingWallet, userId)
    }
  }

  async updateExistingWalletUser(
    existingWallet,
    userId: string,
  ): Promise<WalletEntity> {
    if (existingWallet.user_id != null) {
      throw new BadRequestException('invalid wallet address')
    } else {
      const knexResult = await this.dbWriter('wallet')
        .update({ user_id: userId })
        .where('id', existingWallet.id)
      if (knexResult != 1) {
        throw new InternalServerErrorException(
          'failed to update existing wallet',
        )
      } else {
        return { ...existingWallet, user_id: userId }
      }
    }
  }

  async createUnauthenticated(
    userId: string,
    createUnauthenticatedWalletDto: CreateUnauthenticatedWalletDto,
  ): Promise<void> {
    const numWallets = await this.dbReader('wallet')
      .where('user_id', userId)
      .count('*')
    if (numWallets[0]['count(*)'] >= MAX_WALLETS_PER_USER) {
      throw new BadRequestException(
        `${MAX_WALLETS_PER_USER} wallet limit reached!`,
      )
    }
    await this.dbWriter('wallet').insert({
      id: v4(),
      user_id: userId,
      authenticated: false,
      address: createUnauthenticatedWalletDto.walletAddress,
      chain: createUnauthenticatedWalletDto.chain,
    })
  }

  async remove(userId: string, walletId: string): Promise<boolean> {
    const knexResult = await this.dbWriter('wallet')
      .update({ user_id: null })
      .where('id', walletId)
      .where('user_id', userId)
    return knexResult == 1
  }
}
