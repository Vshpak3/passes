import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectRedis, Redis } from '@nestjs-modules/ioredis'
import { Keypair } from '@solana/web3.js'
import base58 from 'bs58'
import dedent from 'dedent'
import { ethers } from 'ethers'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import nacl from 'tweetnacl'
import { v4 } from 'uuid'
import Web3 from 'web3'
import { Logger } from 'winston'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { localMockedAwsDev } from '../../util/aws.util'
import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { validateAddress } from '../../util/wallet.util'
import { LambdaService } from '../lambda/lambda.service'
import { PassHolderEntity } from '../pass/entities/pass-holder.entity'
import { AuthWalletRequestDto } from './dto/auth-wallet-request.dto'
import { AuthWalletResponseDto } from './dto/auth-wallet-response.dto'
import {
  CreateUnauthenticatedWalletRequestDto,
  CreateWalletRequestDto,
  CreateWalletResponseDto,
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
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly lambdaService: LambdaService,
    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],
    @InjectRedis('publisher') private readonly redisService: Redis,
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
        `Can't have a default wallet on chain ${chain}`,
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

    // create wallet if it does not exist
    const id = v4()
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
      .where(`${DefaultWalletEntity.table}.user_id`, userId)
      .andWhere(`${DefaultWalletEntity.table}.user_id`, userId)
      .andWhere(`${WalletEntity.table}.chain`, chain)
      .andWhere(`${DefaultWalletEntity.table}.chain`, chain)
      .select(`${WalletEntity.table}.*`)
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
  ): Promise<WalletDto> {
    const wallet = await this.dbWriter<WalletEntity>(WalletEntity.table)
      .where({
        chain,
        id: walletId,
        user_id: userId,
      })
      .select('*')
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
      .merge(['wallet_id'])

    return new WalletDto(wallet)
  }

  fixAddress(address: string, chain: ChainEnum): string {
    if (!validateAddress(address, chain)) {
      throw new IncorrectAddressException(
        `${address} is not a valid ${chain} address`,
      )
    }
    if (
      chain === ChainEnum.ETH ||
      chain === ChainEnum.MATIC ||
      chain === ChainEnum.AVAX
    ) {
      return ethers.utils.getAddress(address)
    }
    return address
  }
  getUserWalletRedisKey(userId: string, address: string) {
    return `walletservice.rawMessage.${userId},${address}}`
  }

  async checkWalletCount(userId: string) {
    const wallets = await this.getWalletsForUser(userId)
    if (wallets.length >= MAX_WALLETS_PER_USER) {
      throw new BadRequestException(
        `${MAX_WALLETS_PER_USER} wallet limit reached!`,
      )
    }
    return wallets
  }

  async authMessage(
    userId: string,
    authWalletRequestDto: AuthWalletRequestDto,
  ): Promise<AuthWalletResponseDto> {
    await this.checkWalletCount(userId)
    const walletAddress = this.fixAddress(
      authWalletRequestDto.walletAddress,
      authWalletRequestDto.chain,
    )
    const userWalletRedisKey = this.getUserWalletRedisKey(userId, walletAddress)
    let authMessage = await this.redisService.get(userWalletRedisKey)
    if (authMessage === null) {
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
  ): Promise<CreateWalletResponseDto> {
    await this.checkWalletCount(userId)
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
          this.web3.eth.accounts.recover(
            createWalletDto.rawMessage,
            createWalletDto.signedMessage,
          ) !== walletAddress
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

    let id: string | undefined = undefined
    await this.dbWriter.transaction(async (trx) => {
      const wallet = await trx<WalletEntity>(WalletEntity.table)
        .where({ address: walletAddress, chain: createWalletDto.chain })
        .select('*')
        .forUpdate()
        .first()

      if (!wallet) {
        id = v4()
        await trx<WalletEntity>(WalletEntity.table).insert({
          id,
          user_id: userId,
          address: walletAddress,
          chain: createWalletDto.chain,
          authenticated: true,
        })
      } else if (!wallet.user_id || wallet.user_id === userId) {
        id = wallet.id
        await trx<WalletEntity>(WalletEntity.table)
          .update({
            authenticated: true,
            user_id: userId,
          })
          .where({
            address: walletAddress,
            chain: createWalletDto.chain,
          })
      }
    })

    return new CreateWalletResponseDto(id || null)
  }

  async createUnauthenticatedWallet(
    userId: string,
    createUnauthenticatedWalletDto: CreateUnauthenticatedWalletRequestDto,
  ): Promise<CreateWalletResponseDto> {
    await this.checkWalletCount(userId)
    const { walletAddress, chain } = createUnauthenticatedWalletDto
    const fixedWalletAddress = this.fixAddress(walletAddress, chain)
    const id = v4()
    await createOrThrowOnDuplicate(
      () =>
        this.dbWriter<WalletEntity>(WalletEntity.table).insert({
          id,
          user_id: userId,
          authenticated: false,
          address: fixedWalletAddress,
          chain: createUnauthenticatedWalletDto.chain,
        }),
      this.logger,
      'Address already exists',
    )
    return new CreateWalletResponseDto(id)
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
    return knexResult === 1
  }
}
