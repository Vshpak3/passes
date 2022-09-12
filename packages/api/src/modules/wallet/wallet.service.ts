import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRedis, Redis } from '@nestjs-modules/ioredis'
import { Keypair } from '@solana/web3.js'
import base58 from 'bs58'
import dedent from 'dedent'
import nacl from 'tweetnacl'
import { v4 } from 'uuid'
import Web3 from 'web3'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { localMockedAwsDev } from '../../util/aws.util'
import { LambdaService } from '../lambda/lambda.service'
import { PassHolderEntity } from '../pass/entities/pass-holder.entity'
import { SOL_DEV_NFT_MASTER_WALLET_PRIVATE_KEY } from '../sol/sol.service'
import { AuthWalletRequestDto } from './dto/auth-wallet-request.dto'
import { AuthWalletResponseDto } from './dto/auth-wallet-response.dto'
import {
  CreateUnauthenticatedWalletRequestDto,
  CreateWalletRequestDto,
} from './dto/create-wallet.dto'
import { WalletDto } from './dto/wallet.dto'
import { DefaultWalletEntity } from './entities/default-wallet.entity'
import { WalletEntity } from './entities/wallet.entity'
import { ChainEnum } from './enum/chain.enum'

const WALLET_AUTH_MESSAGE_TTL = 300_000 // wallet auth messages live in redis for 5 minutes
const MAX_WALLETS_PER_USER = 10

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
    return dedent`Click to verify your wallet with Passes

    This request will not trigger a blockchain transaction or cost any gas fees.

    Wallet address:
    ${walletAddress.toLowerCase()}

    Nonce:
    ${nonce}`
  }

  async findWallet(walletId: string): Promise<WalletDto | undefined> {
    const wallet = await this.dbReader(WalletEntity.table)
      .where('id', walletId)
      .select('*')
      .first()

    return new WalletDto(wallet)
  }

  async findByAddress(
    address: string,
    chain: ChainEnum,
  ): Promise<WalletDto | undefined> {
    const wallet = await this.dbReader(WalletEntity.table)
      .select('*')
      .where(`${WalletEntity.table}.address`, address)
      .where(`${WalletEntity.table}.chain`, chain)
      .first()

    if (!wallet) {
      return undefined
    }
    return new WalletDto(wallet)
  }

  /**
   * get (unique) internally managed wallet for user
   * @param userId
   */

  async getUserCustodialWallet(userId: string): Promise<WalletDto> {
    const wallet = await this.dbReader(WalletEntity.table)
      .where(
        WalletEntity.toDict<WalletEntity>({
          user: userId,
          custodial: true,
        }),
      )
      .first()
    if (wallet) {
      return new WalletDto(wallet)
    }

    const id = v4()
    // create wallet if it does not exist
    let address = ''
    if (localMockedAwsDev()) {
      const keypair = Keypair.fromSecretKey(
        base58.decode(SOL_DEV_NFT_MASTER_WALLET_PRIVATE_KEY),
      )
      address = keypair.publicKey.toString()
    } else {
      address = await this.lambdaService.blockchainSignCreateAddress(
        'user-' + id,
      )
    }
    const data = WalletEntity.toDict<WalletEntity>({
      id,
      user: userId,
      address: address,
      chain: ChainEnum.SOL,
      custodial: true,
      authenticated: true,
    })
    await this.dbWriter(WalletEntity.table).insert(data)
    return new WalletDto(data)
  }

  /**
   * get the user's default wallet
   * default wallet can only be on the Solana chain where are passes are
   *
   * @param userId
   * @returns
   */
  async getDefaultWallet(userId: string): Promise<WalletDto> {
    const wallet = await this.dbReader(WalletEntity.table)
      .join(
        DefaultWalletEntity.table,
        `${DefaultWalletEntity.table}.wallet_id`,
        `${WalletEntity.table}.id`,
      )
      .where(
        `${DefaultWalletEntity.table}.user_id`,
        `${WalletEntity.table}.user_id`,
      )
      .andWhere(`${DefaultWalletEntity.table}.user_id`, userId)
      .andWhere(
        WalletEntity.toDict<WalletEntity>({
          chain: ChainEnum.SOL,
        }),
      )
      .select([
        `${WalletEntity.table}.id`,
        `${WalletEntity.table}.user_id`,
        ...WalletEntity.populate<WalletEntity>([
          'address',
          'chain',
          'custodial',
          'authenticated',
        ]),
      ])
      .first()
    if (wallet) {
      return new WalletDto(wallet)
    }

    // if no valid default exists, defer to custodial
    const custodialWallet = await this.getUserCustodialWallet(userId)
    await this.setDefaultWallet(userId, custodialWallet.walletId as string)
    return custodialWallet
  }

  async setDefaultWallet(userId: string, walletId: string): Promise<void> {
    await this.dbWriter(DefaultWalletEntity.table)
      .insert(
        DefaultWalletEntity.toDict<DefaultWalletEntity>({
          user: userId,
          wallet: walletId,
        }),
      )
      .onConflict('user_id')
      .merge(['wallet_id'])
  }

  fixAddress(address: string, chain: ChainEnum): string {
    if (
      chain == ChainEnum.ETH ||
      chain == ChainEnum.MATIC ||
      chain == ChainEnum.AVAX
    ) {
      return address.toLowerCase()
    }
    return address
  }
  getUserWalletRedisKey(userId: string, address: string) {
    return `walletservice.rawMessage.${userId},${address}}`
  }

  async checkWallets(userId: string) {
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
  }
  async authMessage(
    userId: string,
    authWalletRequestDto: AuthWalletRequestDto,
  ): Promise<AuthWalletResponseDto> {
    await this.checkWallets(userId)
    const walletAddress = this.fixAddress(
      authWalletRequestDto.walletAddress,
      authWalletRequestDto.chain,
    )
    const userWalletRedisKey = this.getUserWalletRedisKey(userId, walletAddress)
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

  async getWalletsForUser(userId: string): Promise<WalletDto[]> {
    return (
      await this.dbReader(WalletEntity.table).where(
        WalletEntity.toDict<WalletEntity>({
          user: userId,
        }),
      )
    ).map((wallet) => new WalletDto(wallet))
  }

  async createWallet(
    userId: string,
    createWalletDto: CreateWalletRequestDto,
  ): Promise<boolean> {
    await this.checkWallets(userId)
    const walletAddress = this.fixAddress(
      createWalletDto.walletAddress,
      createWalletDto.chain,
    )
    const userWalletRedisKey = this.getUserWalletRedisKey(userId, walletAddress)

    const rawMessage = await this.redisService.get(userWalletRedisKey)
    if (rawMessage !== createWalletDto.rawMessage) {
      throw new BadRequestException('invalid rawMessage supplied')
    }
    switch (createWalletDto.chain) {
      case ChainEnum.ETH:
        if (
          this.web3.eth.accounts
            .recover(createWalletDto.rawMessage, createWalletDto.signedMessage)
            .toLowerCase() !== walletAddress
        ) {
          throw new BadRequestException(
            'recovered address does not match input',
          )
        }
        break
      case ChainEnum.SOL:
        // eslint-disable-next-line no-case-declarations
        const success = nacl.sign.detached.verify(
          new TextEncoder().encode(createWalletDto.rawMessage),
          base58.decode(createWalletDto.signedMessage),
          base58.decode(walletAddress),
        )
        if (!success) {
          throw new BadRequestException('invalid message signature for address')
        }
        break
      default:
        throw new BadRequestException('invalid chain specified')
    }

    await this.dbWriter(WalletEntity.table)
      .insert(
        WalletEntity.toDict<WalletEntity>({
          user: userId,
          address: walletAddress,
          chain: createWalletDto.chain,
          authenticated: true,
        }),
      )
      .onConflict(['address', 'chain'])
      .ignore()
    // authenticate if already exists
    const updated = await this.dbWriter(WalletEntity.table)
      .update(
        WalletEntity.toDict<WalletEntity>({
          authenticated: true,
        }),
      )
      .where(
        WalletEntity.toDict<WalletEntity>({
          user: userId,
          address: walletAddress,
          chain: createWalletDto.chain,
        }),
      )
    // insert if not exists
    //  if wallet is held by someone else return false
    return updated === 1
  }

  async createUnauthenticatedWallet(
    userId: string,
    createUnauthenticatedWalletDto: CreateUnauthenticatedWalletRequestDto,
  ): Promise<void> {
    await this.checkWallets(userId)
    const walletAddress = this.fixAddress(
      createUnauthenticatedWalletDto.walletAddress,
      createUnauthenticatedWalletDto.chain,
    )
    await this.dbWriter(WalletEntity.table).insert(
      WalletEntity.toDict<WalletEntity>({
        user: userId,
        authenticated: false,
        address: walletAddress,
        chain: createUnauthenticatedWalletDto.chain,
      }),
    )
  }

  async removeWallet(userId: string, walletId: string): Promise<boolean> {
    const knexResult = await this.dbWriter(WalletEntity.table)
      .update({ user_id: null })
      .where('id', walletId)
      .where('user_id', userId)
    await this.dbWriter(PassHolderEntity.table)
      .where('wallet_id', walletId)
      .update('holder_id', null)
    return knexResult == 1
  }
}
