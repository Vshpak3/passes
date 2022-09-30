// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */
import {
  BadRequestException,
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Alchemy, Network, Nft, OwnedNft } from 'alchemy-sdk'
import ms from 'ms'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { PassEntity } from '../pass/entities/pass.entity'
import { PassHolderEntity } from '../pass/entities/pass-holder.entity'
import { RedisLockService } from '../redis-lock/redis-lock.service'
import { WalletEntity } from '../wallet/entities/wallet.entity'
import { ChainEnum } from '../wallet/enum/chain.enum'

const MAX_TIME_WALLET_REFRESH = ms('30 minutes')
const MAX_TIME_PASS_REFRESH = ms('1 week')

@Injectable()
export class EthService {
  private alchemy: Alchemy

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly configService: ConfigService,

    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],

    @Inject(RedisLockService)
    protected readonly lockService: RedisLockService,
  ) {
    const settings = {
      apiKey: this.configService.get('alchemy.eth.api_key') as string,
      network: Network.ETH_MAINNET,
    }
    this.alchemy = new Alchemy(settings)
  }

  async refreshEthNfts(): Promise<void> {
    const passes = await this.dbReader<PassEntity>(PassEntity.table)
      .whereNotNull('collection_address')
      .andWhere('chain', ChainEnum.ETH)
      .select('id', 'collection_address')
    // run synchronously to avoid throttling
    // its fine that its done slowly
    for (let i = 0; i < passes.length; ++i) {
      try {
        await this.getNewEthNftsForPass(
          passes[i].id,
          passes[i].collection_address as string,
          false,
        )
      } catch (err) {
        this.logger.error(`failed eth nft-pass refresh ${passes[i].id}`, err)
      }
    }
    const wallets = await this.dbReader<WalletEntity>(WalletEntity.table).where(
      {
        chain: ChainEnum.ETH,
        authenticated: true,
      },
    )
    // run synchronously to avoid throttling
    // its fine that its done slowly
    for (let i = 0; i < wallets.length; ++i) {
      try {
        await this.refreshEthNftsForWallet(
          wallets[i].user_id,
          wallets[i].id,
          true,
        )
      } catch (err) {
        this.logger.error(`failed eth nft refresh ${wallets[i].id}`, err)
      }
    }
  }

  async getNewEthNftsForPass(
    passId: string,
    ethAddress: string,
    bypass: boolean,
  ) {
    if (!bypass) {
      const redisKey = `getNewNfts:${passId}`
      const lockResult = await this.lockService.lockOnce(
        redisKey,
        MAX_TIME_PASS_REFRESH,
      )
      if (!lockResult) {
        // don't throw error
        // should happen frequently
        return
      }
    }
    const nfts: Nft[] = []
    let pageKey: string | undefined = undefined
    do {
      const response = await this.alchemy.nft.getNftsForContract(ethAddress, {
        pageKey,
      })
      nfts.push(...response.nfts)
      pageKey = response.pageKey
    } while (pageKey)
    await this.dbWriter<PassHolderEntity>(PassHolderEntity.table)
      .insert(
        nfts.map((nft) => {
          return {
            pass_id: passId,
            address: ethAddress,
            chain: ChainEnum.ETH,
            token_id: nft.tokenId,
          }
        }),
      )
      .onConflict(['address', 'chain', 'token_id'])
      .ignore()
  }

  async refreshEthNftsForWallet(
    userId: string | null,
    walletId: string,
    bypass: boolean,
  ): Promise<void> {
    if (!bypass) {
      const redisKey = `refreshEthNftsForWallet:${walletId}`
      const lockResult = await this.lockService.lockOnce(
        redisKey,
        MAX_TIME_WALLET_REFRESH,
      )
      if (!lockResult) {
        throw new ServiceUnavailableException(
          `Please retry this operation after ${
            (await this.lockService.getTTL(redisKey)) || 0
          } seconds`,
        )
      }
    }
    const wallet = await this.dbReader<WalletEntity>(WalletEntity.table)
      .where({ id: walletId, user_id: userId })
      .select('address', 'user_id', 'chain')
      .first()
    if (!wallet || wallet.user_id != userId || wallet.chain != ChainEnum.ETH) {
      throw new BadRequestException('invalid wallet id specified')
    }
    const nfts: OwnedNft[] = []
    let pageKey: string | undefined = undefined
    do {
      const response = await this.alchemy.nft.getNftsForOwner(wallet.address, {
        pageKey,
      })
      nfts.push(...response.ownedNfts)
      pageKey = response.pageKey
    } while (pageKey)
    await this.dbWriter.transaction(async (trx) => {
      await trx<PassHolderEntity>(PassHolderEntity.table)
        .where({ wallet_id: walletId })
        .update({
          wallet_id: null,
          holder_id: null,
        })
      await Promise.all(
        nfts.map(async (nft) => {
          await trx<PassHolderEntity>(PassHolderEntity.table)
            .update({
              wallet_id: walletId,
              holder_id: userId,
            })
            .where({
              address: nft.contract.address.toLowerCase(),
              chain: ChainEnum.ETH,
              token_id: nft.tokenId,
            })
        }),
      )
    })
  }
}
