import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRedis, Redis } from '@nestjs-modules/ioredis'
import { Keypair } from '@solana/web3.js'
import base58 from 'bs58'
import dedent from 'dedent'
import nacl from 'tweetnacl'
import { v4 } from 'uuid'
import Web3 from 'web3'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { localMockedAwsDev } from '../../util/aws.util'
import { validateAddress } from '../../util/wallet.util'
import { LambdaService } from '../lambda/lambda.service'
import { PassHolderEntity } from '../pass/entities/pass-holder.entity'
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
import {
  IncorrectAddressException,
  UnsupportedDefaultWalletError,
  WalletNotFoundError,
} from './error/wallet.error'

const WALLET_AUTH_MESSAGE_TTL = 300_000 // wallet auth messages live in redis for 5 minutes
const MAX_WALLETS_PER_USER = 10

@Injectable()
export class WalletService {
  private web3: Web3

  constructor(
    private readonly lambdaService: LambdaService,
    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
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
    const wallet = await this.dbReader<WalletEntity>(WalletEntity.table)
      .where({ id: walletId })
      .select('*')
      .first()

    return new WalletDto(wallet)
  }

  async findByAddress(
    address: string,
    chain: ChainEnum,
  ): Promise<WalletDto | undefined> {
    const wallet = await this.dbReader<WalletEntity>(WalletEntity.table)
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

  async getUserCustodialWallet(
    userId: string,
    chain: ChainEnum,
  ): Promise<WalletDto> {
    if (chain !== ChainEnum.SOL && chain !== ChainEnum.ETH) {
      throw new UnsupportedDefaultWalletError(
        `can not have a deafult wallet on chain ${chain}`,
      )
    }
    const wallet = await this.dbReader<WalletEntity>(WalletEntity.table)
      .where({
        user_id: userId,
        custodial: true,
        chain,
      })
      .first()
    if (wallet) {
      return new WalletDto(wallet)
    }

    const id = v4()
    // create wallet if it does not exist
    let address = ''
    if (localMockedAwsDev()) {
      const keypair = Keypair.generate()
      address = keypair.publicKey.toString()
    } else {
      address = await this.lambdaService.getOrCreateBlockchainAddress(
        'user.' + id,
        chain,
      )
    }
    const data = {
      id,
      user_id: userId,
      address: address,
      chain,
      custodial: true,
      authenticated: true,
    } as WalletEntity
    await this.dbWriter<WalletEntity>(WalletEntity.table).insert(data)
    return new WalletDto(data)
  }

  /**
   * get the user's default wallet
   * default wallet can only be on the Solana chain where are passes are
   *
   * @param userId
   * @returns
   */
  async getDefaultWallet(userId: string, chain: ChainEnum): Promise<WalletDto> {
    const wallet = await this.dbReader<WalletEntity>(WalletEntity.table)
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
      .andWhere(`${WalletEntity.table}.chain`, chain)
      .andWhere(`${DefaultWalletEntity.table}.chain`, chain)
      .select([`${WalletEntity.table}.*`])
      .first()
    if (wallet) {
      return new WalletDto(wallet)
    }

    // if no valid default exists, defer to custodial
    const custodialWallet = await this.getUserCustodialWallet(userId, chain)
    await this.setDefaultWallet(
      userId,
      custodialWallet.walletId as string,
      chain,
    )
    return custodialWallet
  }

  async setDefaultWallet(
    userId: string,
    walletId: string,
    chain: ChainEnum,
  ): Promise<void> {
    const wallet = await this.dbReader<WalletEntity>(WalletEntity.table)
      .where({
        chain,
        id: walletId,
        user_id: userId,
      })
      .select('id')
      .first()
    if (!wallet) {
      throw new WalletNotFoundError('no wallet found')
    }

    await this.dbWriter<DefaultWalletEntity>(DefaultWalletEntity.table)
      .insert({
        user_id: userId,
        wallet_id: walletId,
        chain,
      })
      .onConflict(['user_id', 'chain'])
      .ignore()
    await this.dbWriter<DefaultWalletEntity>(DefaultWalletEntity.table)
      .update({
        wallet_id: walletId,
      })
      .where({
        user_id: userId,
        chain,
      })
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
      await this.dbReader<WalletEntity>(WalletEntity.table).where({
        user_id: userId,
      })
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
      await this.dbReader<WalletEntity>(WalletEntity.table).where({
        user_id: userId,
      })
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

    await this.dbWriter<WalletEntity>(WalletEntity.table)
      .insert({
        user_id: userId,
        address: walletAddress,
        chain: createWalletDto.chain,
        authenticated: true,
      })
      .onConflict(['address', 'chain'])
      .ignore()
    // authenticate if already exists
    const updated1 = await this.dbWriter<WalletEntity>(WalletEntity.table)
      .update({
        authenticated: true,
        user_id: userId,
      })
      .where({
        user_id: null,
        address: walletAddress,
        chain: createWalletDto.chain,
      })
    const updated2 = await this.dbWriter<WalletEntity>(WalletEntity.table)
      .update({
        authenticated: true,
      })
      .where({
        user_id: userId,
        address: walletAddress,
        chain: createWalletDto.chain,
        authenticated: false,
      })
    // insert if not exists
    //  if wallet is held by someone else return false
    return updated1 + updated2 === 1
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
    if (!validateAddress(walletAddress, createUnauthenticatedWalletDto.chain)) {
      throw new IncorrectAddressException(
        `${walletAddress} is not a valid ${createUnauthenticatedWalletDto.chain} address`,
      )
    }
    await this.dbWriter<WalletEntity>(WalletEntity.table)
      .insert({
        user_id: userId,
        authenticated: false,
        address: walletAddress,
        chain: createUnauthenticatedWalletDto.chain,
      })
      .onConflict(['chain', 'address'])
      .ignore()
  }

  async removeWallet(userId: string, walletId: string): Promise<boolean> {
    const knexResult = await this.dbWriter<WalletEntity>(WalletEntity.table)
      .update({ user_id: null })
      .where({ id: walletId })
      .andWhere({ user_id: userId })
      .andWhere({ custodial: false })
    if (knexResult === 1) {
      await this.dbWriter<PassHolderEntity>(PassHolderEntity.table)
        .where({ wallet_id: walletId })
        .update({ holder_id: null })
    }
    return knexResult == 1
  }
}
