// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */
import {
  BadRequestException,
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Alchemy, AlchemyProvider, Network, Nft, OwnedNft } from 'alchemy-sdk'
import { Contract, ContractFactory } from 'ethers'
import ms from 'ms'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { ContentFormatEnum } from '../content/enums/content-format.enum'
import { LambdaService } from '../lambda/lambda.service'
import { PassEntity } from '../pass/entities/pass.entity'
import { PassHolderEntity } from '../pass/entities/pass-holder.entity'
import { RedisLockService } from '../redis-lock/redis-lock.service'
import {
  getCollectionImageUri,
  getNftMetadataPath,
  getNftMetadataUri,
} from '../s3content/s3.nft.helper'
import { S3ContentService } from '../s3content/s3content.service'
import { UserEntity } from '../user/entities/user.entity'
import { WalletEntity } from '../wallet/entities/wallet.entity'
import { ChainEnum } from '../wallet/enum/chain.enum'
import { contractSpec } from './contracts/ERC721Passes'
import { InternalSigner } from './signer'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ETH_MASTER_WALLET_LAMBDA_KEY_ID = 'eth-master-wallet'

const MAX_TIME_WALLET_REFRESH = ms('30 minutes')
const MAX_TIME_PASS_REFRESH = ms('1 week')

const SIGNER_ID_PREFIX_PASS = 'pass'
const MAX_DEPLOY_ATTEMPTS = 1

const TOPIC_TOKEN_ID_INDEX = 3
@Injectable()
export class EthService {
  private alchemy: Alchemy
  private alchemyProvider: AlchemyProvider
  private cloudfrontUrl: string
  private nftS3Bucket: string

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
    private readonly lambdaService: LambdaService,
    private readonly s3contentService: S3ContentService,
  ) {
    const settings = {
      apiKey: this.configService.get('alchemy.eth.api_key') as string,
      network:
        configService.get('infra.env') === 'prod'
          ? Network.ETH_MAINNET
          : Network.ETH_GOERLI,
    }
    this.alchemy = new Alchemy(settings)
    this.cloudfrontUrl = configService.get('cloudfront.baseUrl') as string
    this.nftS3Bucket = configService.get('s3_bucket.nft') as string
  }

  async onModuleInit() {
    this.alchemyProvider = await this.alchemy.config.getProvider()
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

  private async createNftMetadataJson(
    creatorId: string,
    passId: string,
    passHolderId: string,
    name: string,
    symbol: string,
    description: string,
    contentType: ContentFormatEnum = ContentFormatEnum.IMAGE,
  ) {
    const username = (
      await this.dbReader<UserEntity>(UserEntity.table)
        .where({ id: creatorId })
        .first()
    )?.username

    const imageUrl = getCollectionImageUri(
      this.cloudfrontUrl,
      passId,
      contentType,
    )

    const metadataJson = {
      name,
      symbol,
      description,
      image: imageUrl,
      animation_url: imageUrl,
      external_url: `https://www.passes.com/${username}`,
    }

    await this.s3contentService.putObject({
      Bucket: this.nftS3Bucket,
      Body: JSON.stringify(metadataJson),
      Key: getNftMetadataUri(null, passId, passHolderId),
    })

    return getNftMetadataPath(passId, passHolderId)
  }

  async createEthNft(
    creatorId: string,
    passId: string,
    passHolderId: string,
    name: string,
    symbol: string,
    description: string,
    contractAddress: string,
    ownerAddress: string,
    contentType: ContentFormatEnum = ContentFormatEnum.IMAGE,
  ): Promise<string> {
    const masterWallet = new InternalSigner(
      ETH_MASTER_WALLET_LAMBDA_KEY_ID,
      this.lambdaService,
      this.alchemyProvider,
    )

    const contract = new Contract(
      contractAddress,
      contractSpec.abi,
      masterWallet,
    )
    const path = await this.createNftMetadataJson(
      creatorId,
      passId,
      passHolderId,
      name,
      symbol,
      description,
      contentType,
    )
    let error: Error | undefined = undefined
    for (let i = 0; i < MAX_DEPLOY_ATTEMPTS; ++i) {
      try {
        const receipt = await (
          await contract.mintUri(ownerAddress, path)
        ).wait()
        return receipt.logs[0].topics[TOPIC_TOKEN_ID_INDEX]
      } catch (err) {
        error = err
      }
    }
    throw error
  }

  async createEthNftCollection(
    passId: string,
    name: string,
    symbol: string,
    royalties: number,
  ): Promise<string> {
    const masterWallet = new InternalSigner(
      ETH_MASTER_WALLET_LAMBDA_KEY_ID,
      this.lambdaService,
      this.alchemyProvider,
    )

    const royaltyWallet = new InternalSigner(
      `${SIGNER_ID_PREFIX_PASS}.${passId}`,
      this.lambdaService,
      this.alchemyProvider,
    )

    const factory = new ContractFactory(
      contractSpec.abi,
      contractSpec.bytecode,
      masterWallet,
    )

    // console.log(contract.address)
    const contract = await factory.deploy(
      name,
      symbol,
      this.cloudfrontUrl + '/',
      await royaltyWallet.getAddress(),
      royalties,
      { gasLimit: 5000000 },
    )
    let error: Error | undefined = undefined
    for (let i = 0; i < MAX_DEPLOY_ATTEMPTS; ++i) {
      try {
        const receipt = await contract.deployTransaction.wait()
        return receipt.contractAddress
      } catch (err) {
        error = err
      }
    }
    throw error
  }
}
