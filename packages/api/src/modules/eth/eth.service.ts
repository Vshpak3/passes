import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as https from 'https'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { RedisLockService } from '../redisLock/redisLock.service'
import { UserEntity } from '../user/entities/user.entity'
import { WalletResponseDto } from '../wallet/dto/wallet-response.dto'
import { WalletEntity } from '../wallet/entities/wallet.entity'
import { Chain } from '../wallet/enum/chain.enum'
import { ETH_NFT_COLLECTION_EXISTS } from './constants/errors'
import { CreateEthNftCollectionDto } from './dto/create-eth-nft-collection.dto'
import { EthNftEntity } from './entities/eth-nft.entity'
import { EthNftCollectionEntity } from './entities/eth-nft-collection.entity'

@Injectable()
export class EthService {
  ethNftTable: string
  ethNftCollectionTable: string
  constructor(
    @InjectRepository(EthNftEntity, 'ReadWrite')
    private readonly ethNftRepository: EntityRepository<EthNftEntity>,

    @InjectRepository(EthNftCollectionEntity, 'ReadWrite')
    private readonly ethNftCollectionRepository: EntityRepository<EthNftCollectionEntity>,

    @InjectRepository(WalletEntity, 'ReadWrite')
    private readonly walletRepository: EntityRepository<WalletEntity>,

    @InjectRepository(UserEntity, 'ReadWrite')
    private readonly userRepository: EntityRepository<UserEntity>,

    @Database('ReadOnly')
    private readonly ReadOnlyDatabaseService: DatabaseService,
    @Database('ReadWrite')
    private readonly ReadWriteDatabaseService: DatabaseService,

    private readonly configService: ConfigService,

    @Inject(RedisLockService)
    protected readonly lockService: RedisLockService,
  ) {
    this.ethNftTable = this.ReadWriteDatabaseService.getTableName(EthNftEntity)
    this.ethNftCollectionTable = this.ReadWriteDatabaseService.getTableName(
      EthNftCollectionEntity,
    )
  }

  async createNftCollection(
    userId: string,
    createEthNftCollectionDto: CreateEthNftCollectionDto,
  ): Promise<EthNftCollectionEntity> {
    // TODO: find a better way to only allow admins to access this endpoint MNT-144
    const { knex, toDict, v4, getTableName } = this.ReadWriteDatabaseService
    const userTable = getTableName(UserEntity)
    const user = await knex(userTable).where({ id: userId }).first()
    if (!user.email.endsWith('@moment.vip')) {
      throw new UnauthorizedException('this endpoint is not accessible')
    }
    const id = v4()
    const data = toDict(EthNftCollectionEntity, {
      id,
      ...createEthNftCollectionDto,
    })

    const query = () => knex(this.ethNftCollectionTable).insert(data)

    await createOrThrowOnDuplicate(query, ETH_NFT_COLLECTION_EXISTS)
    // TODO: fix return type
    return data as any
  }

  // TODO: Refactor to new database setup
  async refreshNftsForWallet(
    userId: string,
    walletId: string,
  ): Promise<WalletResponseDto> {
    const redisKey = `refreshNftsForWallet:${walletId}`
    const lockResult = await this.lockService.lockOnce(redisKey, 300_000)
    if (!lockResult) {
      throw new ServiceUnavailableException(
        `Please retry this operation after ${
          (await this.lockService.getTTL(redisKey)) || 0
        } seconds`,
      )
    }
    const user = await this.userRepository.getReference(userId)
    const wallet = await this.walletRepository.findOneOrFail({
      id: walletId,
      user: user,
    })

    if (!wallet.user || wallet.user.id != userId || wallet.chain != Chain.ETH) {
      throw new BadRequestException('invalid wallet id specified')
    }

    const nftCollections = await this.ethNftCollectionRepository.findAll()
    let onChainTokens: Array<any> = []
    for (let i = 0; i < nftCollections.length; i++) {
      const result = (await this.getTokenData(wallet, nftCollections[i])).result
      onChainTokens = onChainTokens.concat(result)
    }

    const onChainTokenMap = new Map()
    onChainTokens.forEach((onChainToken) => {
      onChainTokenMap.set(
        `${onChainToken['token_address']},${onChainToken['token_id']}`,
        onChainToken,
      )
    })
    const walletTokens = await this.ethNftRepository.find({ wallet: wallet })
    const ethNfts: Array<EthNftEntity> = []

    // first, remove tokens from our db that have been removed from the user's wallet
    walletTokens.forEach((walletToken) => {
      if (
        onChainTokenMap.has(
          `${walletToken.ethNftCollection.tokenAddress},${walletToken.tokenId}`,
        )
      ) {
        // this token already exists in the user's wallet in our db
        onChainTokenMap.delete(
          `${walletToken.ethNftCollection.tokenAddress},${walletToken.tokenId}`,
        )
        ethNfts.push(walletToken)
      } else {
        // this token has been removed from the user's wallet on-chain and should be removed from the db
        this.ethNftRepository.nativeDelete(walletToken)
      }
    })

    // now, add new tokens to our db that the user has gained since we last refreshed
    const nftCollectionMap = new Map()
    nftCollections.forEach((nftCollection) => {
      nftCollectionMap.set(nftCollection.tokenAddress, nftCollection)
    })
    onChainTokenMap.forEach((onChainToken) => {
      const ethNft = this.ethNftRepository.create({
        wallet: wallet,
        ethNftCollection: nftCollectionMap.get(onChainToken['token_address']),
        tokenId: onChainToken['token_id'],
        tokenHash: onChainToken['token_hash'],
      })
      ethNfts.push(ethNft)
    })

    this.ethNftRepository.flush()
    return new WalletResponseDto(wallet, ethNfts)
  }

  private async getTokenData(
    wallet: WalletEntity,
    nftCollection: EthNftCollectionEntity,
  ): Promise<any> {
    return new Promise((resolve) => {
      const path = `/api/v2/${wallet.address}/nft?chain=eth&token_addresses=${nftCollection.tokenAddress}&limit=1`
      const options = {
        hostname: this.configService.get('moralis.api_host'),
        path: path,
        headers: {
          accept: 'application/json',
          'X-API-Key': this.configService.get('moralis.api_key'),
        },
      }
      https.get(options, (res) => {
        let data = ''
        res.on('data', (chunk) => {
          data += chunk
        })
        res.on('end', () => {
          if (
            res.statusCode != undefined &&
            res.statusCode >= 200 &&
            res.statusCode <= 299
          ) {
            resolve(JSON.parse(data))
          } else {
            throw new InternalServerErrorException(
              `Request to Moralis failed. status: ${res.statusCode} body: ${data}`,
            )
          }
        })
      })
    })
  }
}
