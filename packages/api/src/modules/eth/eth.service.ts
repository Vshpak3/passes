// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
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
import { localMockedAwsDev } from '../../util/aws.util'
import { LambdaService } from '../lambda/lambda.service'
import { PassEntity } from '../pass/entities/pass.entity'
import { PassHolderEntity } from '../pass/entities/pass-holder.entity'
import { PassAnimationEnum } from '../pass/enum/pass-animation.enum'
import { PassImageEnum } from '../pass/enum/pass-image.enum'
import { RedisLockService } from '../redis-lock/redis-lock.service'
import { getNftMediaUri, getNftMetadataUri } from '../s3content/s3.nft.helper'
import { S3ContentService } from '../s3content/s3content.service'
import { UserEntity } from '../user/entities/user.entity'
import { WalletEntity } from '../wallet/entities/wallet.entity'
import { ChainEnum } from '../wallet/enum/chain.enum'
import { contractSpec } from './contracts/ERC721Passes'
import { EthNonceEntity } from './entities/eth.nonce.entity'
import { InternalSigner } from './signer'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ETH_MASTER_WALLET_LAMBDA_KEY_ID = 'eth-master-wallet'

const MAX_TIME_WALLET_REFRESH = ms('30 minutes')
const MAX_TIME_PASS_REFRESH = ms('1 week')

const SIGNER_ID_PREFIX_PASS = 'pass'

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

  async getSenderOfTransaction(txHash: string) {
    const receipt = await this.alchemyProvider.getTransactionReceipt(txHash)
    return receipt ? receipt.from : undefined
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
    if (
      !wallet ||
      wallet.user_id !== userId ||
      wallet.chain !== ChainEnum.ETH
    ) {
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
              address: nft.contract.address,
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
    imageType: PassImageEnum,
    animationType?: PassAnimationEnum,
  ) {
    const username = (
      await this.dbReader<UserEntity>(UserEntity.table)
        .where({ id: creatorId })
        .first()
    )?.username

    const imageUrl = getNftMediaUri(
      this.cloudfrontUrl,
      passHolderId,
      passId,
      imageType,
    )

    const metadataJson: any = {
      name,
      symbol,
      description,
      image: imageUrl,
      external_url: `https://www.passes.com/${username}`,
    }

    if (animationType) {
      const videoUrl = getNftMediaUri(
        this.cloudfrontUrl,
        passId,
        passHolderId,
        animationType,
      )
      metadataJson.animation_url = videoUrl
    }

    await this.s3contentService.putObject({
      Bucket: this.nftS3Bucket,
      Body: JSON.stringify(metadataJson),
      Key: getNftMetadataUri(null, passId, passHolderId),
    })

    return getNftMetadataUri(null, passId, passHolderId)
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
    imageType: PassImageEnum,
    animationType?: PassAnimationEnum,
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
      imageType,
      animationType,
    )
    const nonce = await this.getNewNonce(ETH_MASTER_WALLET_LAMBDA_KEY_ID)
    try {
      const receipt = await (
        await contract.mintUri(ownerAddress, path, { nonce })
      ).wait()
      return receipt.logs[0].topics[TOPIC_TOKEN_ID_INDEX]
    } catch (err) {
      await this.cancelTransaction(masterWallet, nonce)
      throw new InternalServerErrorException('could not mint eth' + err)
    }
  }

  async createEthNftCollection(
    passId: string,
    name: string,
    symbol: string,
    royalties: number,
  ): Promise<string> {
    if (localMockedAwsDev()) {
      return ''
    }

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

    const nonce = await this.getNewNonce(ETH_MASTER_WALLET_LAMBDA_KEY_ID)
    try {
      const contract = await factory.deploy(
        name,
        symbol,
        this.cloudfrontUrl + '/',
        await royaltyWallet.getAddress(),
        royalties,
        {
          gasLimit: 5000000,
          nonce,
        },
      )
      const receipt = await contract.deployTransaction.wait()
      return receipt.contractAddress
    } catch (err) {
      await this.cancelTransaction(masterWallet, nonce)
      throw new InternalServerErrorException('could not mint eth' + err)
    }
  }

  async cancelTransaction(signer: InternalSigner, nonce: number) {
    try {
      await signer.sendTransaction({
        to: signer.getAddress(),
        value: 0,
        nonce,
      })
    } catch (err2) {
      this.logger.error(err2)
    }
  }

  async getNewNonce(key: string): Promise<number> {
    let nonce = 0
    await this.dbWriter.transaction(async (trx) => {
      const row = await trx<EthNonceEntity>(EthNonceEntity.table)
        .where({ key_identifier: key })
        .select('*')
        .forUpdate()
        .first()
      nonce = row?.nonce ?? 0
      await trx<EthNonceEntity>(EthNonceEntity.table)
        .where({ key_identifier: key })
        .increment('nonce')
    })
    return nonce
  }
}
