// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */
import {
  BadRequestException,
  Inject,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Alchemy, Network, OwnedNft } from 'alchemy-sdk'
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
  alchemy: Alchemy
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
  ) {
    const settings = {
      apiKey: this.configService.get('alchemy.sol.api_key') as string,
      network: Network.ETH_MAINNET,
    }
    this.alchemy = new Alchemy(settings)
  }

  async createNftCollection(
    userId: string,
    createEthNftCollectionDto: CreateEthNftCollectionRequestDto,
  ): Promise<EthNftCollectionDto> {
    // TODO: find a better way to only allow admins to access this endpoint MNT-144
    const user = await this.dbReader(UserEntity.table)
      .where({ id: userId })
      .first()
    if (!user.email.endsWith('@passes.com')) {
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
      await this.dbWriter(BatchEthWalletRefreshEntity.table).insert(
        BatchEthWalletRefreshEntity.toDict<BatchEthWalletRefreshEntity>({
          id: batchId,
          lastProcessedId: null,
        }),
      )
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
      await walletsQuery.where('wallet.id', '>', lastProcessedId)
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
    const onChainTokenMap = new Map<string, OwnedNft>()
    for (let i = 0; i < nftCollections.length; i++) {
      const ownedNfts = (
        await this.alchemy.nft.getNftsForOwner(wallet.address, {
          contractAddresses: [nftCollections[i].tokenAddress],
        })
      ).ownedNfts
      for (let j = 0; j < ownedNfts.length; j++) {
        onChainTokenMap.set(
          `${nftCollections[i].tokenAddress},${ownedNfts[j].tokenId}`,
          ownedNfts[j],
        )
      }
    }
    const walletTokens = await this.dbReader(EthNftEntity.table)
      .where({ id: walletId })
      .first()

    const ethNfts: Array<EthNftEntity> = []

    // first, remove tokens from our db that have been removed from the user's wallet
    walletTokens.forEach(async (walletToken) => {
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
        await this.dbWriter(EthNftEntity.table)
          .where({ id: walletToken.id })
          .delete()
      }
    })

    // now, add new tokens to our db that the user has gained since we last refreshed
    const nftCollectionMap = new Map()
    nftCollections.forEach((nftCollection) => {
      nftCollectionMap.set(nftCollection.tokenAddress, nftCollection)
    })
    onChainTokenMap.forEach(async (_, key) => {
      const tokenData = key.split(',')
      const ethNft = new EthNftEntity()
      ethNft.wallet = wallet
      ethNft.ethNftCollection = nftCollectionMap.get(tokenData[0])
      ethNft.tokenId = tokenData[1]

      ethNfts.push(ethNft)

      // TODO: make this into a transaction
      await this.dbWriter(EthNftEntity.table).insert(
        EthNftEntity.toDict(ethNft),
      )
    })

    return new WalletResponseDto(wallet, ethNfts)
  }
}
