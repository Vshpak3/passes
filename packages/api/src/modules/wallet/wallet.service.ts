import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRedis, Redis } from '@nestjs-modules/ioredis'
import base58 from 'bs58'
import dedent from 'dedent'
import nacl from 'tweetnacl'
import * as uuid from 'uuid'
import Web3 from 'web3'

import { UserEntity } from '../user/entities/user.entity'
import { AuthWalletRequestDto } from './dto/auth-wallet-request.dto'
import { AuthWalletResponseDto } from './dto/auth-wallet-response.dto'
import { CreateWalletDto } from './dto/create-wallet.dto'
import { WalletEntity } from './entities/wallet.entity'
import { Chain } from './enum/chain.enum'

export const WALLET_AUTH_MESSAGE_TTL = 300_000 // wallet auth messages live in redis for 5 minutes
export const MAX_WALLETS_PER_USER = 10

@Injectable()
export class WalletService {
  web3: Web3
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepository: EntityRepository<WalletEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
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
    const userWalletRedisKey = `walletservice.rawMessage.${userId},${authWalletRequestDto.walletAddress.toLowerCase()}`
    let authMessage = await this.redisService.get(userWalletRedisKey)
    if (authMessage == null) {
      authMessage = this.getRawMessage(
        authWalletRequestDto.walletAddress,
        uuid.v4(),
      )
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

  async create(userId: string, createWalletDto: CreateWalletDto): Promise<any> {
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
    const wallet = new WalletEntity()
    const userWalletRedisKey = `walletservice.rawMessage.${userId},${createWalletDto.walletAddress.toLowerCase()}`
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
      if (
        address.toLowerCase() != createWalletDto.walletAddress.toLowerCase()
      ) {
        throw new BadRequestException('recovered address does not match input')
      }
      wallet.address = address
    } else if (createWalletDto.chain == Chain.SOL) {
      const signatureUint8 = base58.decode(createWalletDto.signedMessage)
      const nonceUint8 = new TextEncoder().encode(createWalletDto.rawMessage)
      const pubKeyUint8 = base58.decode(createWalletDto.walletAddress)
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
    wallet.chain = createWalletDto.chain
    await this.walletRepository.persistAndFlush(wallet)
    return wallet
  }
}
