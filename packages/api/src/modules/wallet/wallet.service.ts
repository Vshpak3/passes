import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { BadRequestException, Injectable } from '@nestjs/common'
import base58 from 'bs58'
import nacl from 'tweetnacl'
import Web3 from 'web3'

import { UserEntity } from '../user/entities/user.entity'
import { CreateWalletDto } from './dto/create-wallet.dto'
import { WalletEntity } from './entities/wallet.entity'
import { Chain } from './enum/chain.enum'

@Injectable()
export class WalletService {
  web3: Web3
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepository: EntityRepository<WalletEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
  ) {
    this.web3 = new Web3(
      'https://eth-mainnet.g.alchemy.com/v2/dDJnsm97esWl2C9fFvmuS6pUMKOe6rlM',
    )
  }

  async getWalletsForUser(userId: string): Promise<WalletEntity[]> {
    const user = await this.userRepository.getReference(userId)
    return await this.walletRepository.find({
      user: user,
    })
  }

  async create(userId: string, createWalletDto: CreateWalletDto): Promise<any> {
    const user = await this.userRepository.getReference(userId)
    const wallet = new WalletEntity()
    wallet.user = user
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
