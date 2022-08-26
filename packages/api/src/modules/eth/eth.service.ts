// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */
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
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import * as uuid from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { createOrThrowOnDuplicate } from '../../util/db-nest.util'
import { RedisLockService } from '../redisLock/redisLock.service'
import { UserEntity } from '../user/entities/user.entity'
import { WalletResponseDto } from '../wallet/dto/wallet-response.dto'
import { WalletEntity } from '../wallet/entities/wallet.entity'
import { ChainEnum } from '../wallet/enum/chain.enum'
import { ETH_NFT_COLLECTION_EXISTS } from './constants/errors'
import { CreateEthNftCollectionRequestDto } from './dto/create-eth-nft-collection.dto'
import { EthNftCollectionDto } from './dto/eth-nft-collection.dto'
import { BatchEthWalletRefreshEntity } from './entities/batch-eth-wallet-refresh.entity'
import { EthNftEntity } from './entities/eth-nft.entity'
import { EthNftCollectionEntity } from './entities/eth-nft-collection.entity'

const BATCH_WALLET_REFRESH_CHUNK_SIZE = 500

@Injectable()
export class EthService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly configService: ConfigService,

    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],

    @Inject(RedisLockService)
    protected readonly lockService: RedisLockService,
  ) {}

  async createNftCollection(
    userId: string,
    createEthNftCollectionDto: CreateEthNftCollectionRequestDto,
  ): Promise<EthNftCollectionDto> {
    // TODO: find a better way to only allow admins to access this endpoint MNT-144
    const user = await this.dbReader(UserEntity.table)
      .where({ id: userId })
      .first()
    if (!user.email.endsWith('@moment.vip')) {
      throw new UnauthorizedException('this endpoint is not accessible')
    }
    const data = EthNftCollectionEntity.toDict<EthNftCollectionEntity>({
      ...createEthNftCollectionDto,
    })

    const query = () => this.dbWriter(EthNftCollectionEntity.table).insert(data)

    await createOrThrowOnDuplicate(
      query,
      this.logger,
      ETH_NFT_COLLECTION_EXISTS,
    )
    // TODO: fix return type
    return new EthNftCollectionDto(data)
  }

  async getBatchEthWalletRefresh(): Promise<{
    id: string
    last_processed_id: string | null
  }> {
    const batchEthWalletRefresh = await this.dbReader(
      BatchEthWalletRefreshEntity.table,
    )
      .select(
        'batch_eth_wallet_refresh.id',
        'batch_eth_wallet_refresh.last_processed_id',
      )
      .where('batch_eth_wallet_refresh.last_processed_id', null)
      .orWhereNot(
        'batch_eth_wallet_refresh.last_processed_id',
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
      )
      .first()
    if (batchEthWalletRefresh) {
      return batchEthWalletRefresh
    } else {
      const batchId = uuid.v4()
      await this.dbWriter(BatchEthWalletRefreshEntity.table).insert({
        id: batchId,
        last_processed_id: null,
      })
      return {
        id: batchId,
        last_processed_id: null,
      }
    }
  }

  async processBatchWalletRefreshChunk(
    id: string,
    lastProcessedId: string | null,
  ): Promise<void> {
    const walletsQuery = this.dbReader(WalletEntity.table)
      .select('wallet.id', 'wallet.user_id')
      .where('wallet.chain', ChainEnum.ETH)
    if (lastProcessedId != null) {
      walletsQuery.where('wallet.id', '>', lastProcessedId)
    }
    const wallets = await walletsQuery.limit(BATCH_WALLET_REFRESH_CHUNK_SIZE)

    if (wallets.length == 0) {
      await this.dbWriter(BatchEthWalletRefreshEntity.table)
        .update(
          'batch_eth_wallet_refresh.last_processed_id',
          'ffffffff-ffff-ffff-ffff-ffffffffffff',
        )
        .where('batch_eth_wallet_refresh.id', id)
      return
    }
    for (let i = 0; i < wallets.length; i++) {
      try {
        await this.refreshNftsForWallet(wallets[i].user_id, wallets[i].id)
        await this.dbWriter(BatchEthWalletRefreshEntity.table)
          .update('batch_eth_wallet_refresh.last_processed_id', wallets[i].id)
          .where('batch_eth_wallet_refresh.id', id)
      } catch (err) {
        this.logger.error(
          `error refreshing wallet ${wallets[i].id} as part of batch eth wallet refresh ${id}`,
          err,
        )
      }
    }
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
    const wallet = await this.dbReader(WalletEntity.table)
      .where({ id: walletId, user_id: userId })
      .first()

    if (
      !wallet.user ||
      wallet.user.id != userId ||
      wallet.chain != ChainEnum.ETH
    ) {
      throw new BadRequestException('invalid wallet id specified')
    }

    const nftCollections = await this.dbReader(
      EthNftCollectionEntity.table,
    ).select('*')
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
    const walletTokens = await this.dbReader(EthNftEntity.table)
      .where({ id: walletId })
      .first()

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
        this.dbWriter(EthNftEntity.table).where({ id: walletToken.id }).delete()
      }
    })

    // now, add new tokens to our db that the user has gained since we last refreshed
    const nftCollectionMap = new Map()
    nftCollections.forEach((nftCollection) => {
      nftCollectionMap.set(nftCollection.tokenAddress, nftCollection)
    })
    onChainTokenMap.forEach((onChainToken) => {
      const ethNft = new EthNftEntity()
      ethNft.wallet = wallet
      ethNft.ethNftCollection = nftCollectionMap.get(
        onChainToken['token_address'],
      )
      ethNft.tokenId = onChainToken['token_id']
      ethNft.tokenHash = onChainToken['token_hash']

      ethNfts.push(ethNft)

      // TODO: make this into a transaction
      this.dbWriter(EthNftEntity.table).insert(EthNftEntity.toDict(ethNft))
    })

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
