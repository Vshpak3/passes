import { DataV2 } from '@metaplex-foundation/mpl-token-metadata'
import { Inject, ServiceUnavailableException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry'
import {
  ACCOUNT_SIZE,
  AccountLayout,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmRawTransaction,
  Transaction,
} from '@solana/web3.js'
import base58 from 'bs58'
import ms from 'ms'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import * as uuid from 'uuid'
import { Logger } from 'winston'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { localMockedAwsDev } from '../../util/aws.util'
import { LambdaService } from '../lambda/lambda.service'
import { PassHolderEntity } from '../pass/entities/pass-holder.entity'
import { PassAnimationEnum } from '../pass/enum/pass-animation.enum'
import { PassImageEnum } from '../pass/enum/pass-image.enum'
import { RedisLockService } from '../redis-lock/redis-lock.service'
import {
  getCollectionMediaUri,
  getCollectionMetadataUri,
  getNftMediaUri,
  getNftMetadataUri,
  PassSize,
} from '../s3content/s3.nft.helper'
import { S3ContentService } from '../s3content/s3content.service'
import { UserEntity } from '../user/entities/user.entity'
import { WalletEntity } from '../wallet/entities/wallet.entity'
import { ChainEnum } from '../wallet/enum/chain.enum'
import { createCollectionTransaction, createNftTransaction } from './chain'
import { GetSolNftResponseDto } from './dto/get-sol-nft.dto'
import { GetSolNftCollectionResponseDto } from './dto/get-sol-nft-collection.dto'
import { JsonMetadata } from './json-metadata.interface'

const SOL_MASTER_WALLET_LAMBDA_KEY_ID = 'sol-master-wallet'

const MAX_TIME_NFT_REFRESH = ms('30 minutes')

const SIGNER_ID_PREFIX_PASS = 'pass'
const SIGNER_ID_PREFIX_PASSHOLDER = 'passholder'

// const CHECK_SIGNATURE_ATTEMPTS = 6
// const CHECK_SIGNATURE_TIME = ms('10 seconds')

export class SolService {
  private _connection: Connection | undefined
  private cloudfrontUrl: string
  private nftS3Bucket: string

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    @InjectSentry() private readonly sentry: SentryService,
    private readonly configService: ConfigService,

    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],

    private readonly lambdaService: LambdaService,
    private readonly s3contentService: S3ContentService,
    @Inject(RedisLockService)
    protected readonly lockService: RedisLockService,
  ) {
    this._connection = undefined
    this.cloudfrontUrl = configService.get('cloudfront.baseUrl') as string
    this.nftS3Bucket = configService.get('s3_bucket.nft') as string
  }

  private getConnection(): Connection {
    if (this._connection === undefined) {
      this._connection = new Connection(
        this.configService.get('alchemy.sol.https_endpoint') +
          '/' +
          this.configService.get('alchemy.sol.api_key'),
      )
    }
    return this._connection
  }

  async refreshSolNfts() {
    const passholders = await this.dbReader<PassHolderEntity>(
      PassHolderEntity.table,
    )
      .where({ chain: ChainEnum.SOL })
      .select(['address', 'id'])
    // run synchronously to avoid throttling
    // its fine that its done slowly

    for (let i = 0; i < passholders.length; ++i) {
      try {
        await this.refreshSolNft(
          passholders[i].id,
          passholders[i].address,
          true,
          this.getConnection(),
        )
      } catch (err) {
        this.logger.error(`failed sol nft refresh ${passholders[i].id}`, err)
        this.sentry.instance().captureException(err)
      }
    }
  }

  async refreshSolNft(
    passHolderId: string,
    address: string,
    bypass: boolean,
    connection?: Connection,
  ): Promise<void> {
    if (!bypass) {
      const redisKey = `refreshSolNft:${passHolderId}`
      const lockResult = await this.lockService.lockOnce(
        redisKey,
        MAX_TIME_NFT_REFRESH,
      )
      if (!lockResult) {
        throw new ServiceUnavailableException(
          `Please retry this operation after ${
            (await this.lockService.getTTL(redisKey)) || 0
          } seconds`,
        )
      }
    }
    if (!connection) {
      connection = await this.getConnection()
    }
    const walletAddress = (
      await this.getOwnerOfPass(connection, new PublicKey(address))
    )?.toBase58()
    if (walletAddress) {
      const wallet = await this.dbReader<WalletEntity>(WalletEntity.table)
        .where({
          chain: ChainEnum.SOL,
          address: walletAddress,
          authenticated: true,
        })
        .select(['id', 'user_id'])
        .first()
      if (wallet) {
        await this.dbWriter<PassHolderEntity>(PassHolderEntity.table)
          .where({
            id: passHolderId,
          })
          .update({
            wallet_id: wallet.id,
            holder_id: wallet.user_id,
          })
      }
    }
  }

  /**
   * Retrieve the owner of a given pass using getProgramAccounts on the token
   * program.
   */
  async getOwnerOfPass(
    connection: Connection,
    passMint: PublicKey,
  ): Promise<null | PublicKey> {
    // eslint-disable-next-line no-magic-numbers
    const amount = Buffer.alloc(8)
    amount.writeBigUInt64LE(BigInt(1))

    const accounts = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
      filters: [
        {
          dataSize: ACCOUNT_SIZE,
        },
        {
          memcmp: {
            offset: 0,
            bytes: passMint.toBase58(),
          },
        },
        {
          memcmp: {
            offset: 64,
            bytes: base58.encode(amount),
          },
        },
      ],
    })

    if (accounts.length === 0) {
      return null
    }
    const tokenAccount = AccountLayout.decode(accounts[0].account.data)

    return tokenAccount.owner
  }

  private async lambdaSignTransaction(
    transaction: Transaction,
    walletPubKey: PublicKey,
    signerPubKey: PublicKey,
    signerId: string,
  ): Promise<string> {
    const blockhash = await this.getConnection().getLatestBlockhash()
    transaction.recentBlockhash = blockhash.blockhash
    transaction.feePayer = walletPubKey

    const walletSignature = await this.lambdaService.blockchainSignSolMessage(
      SOL_MASTER_WALLET_LAMBDA_KEY_ID,
      Uint8Array.from(transaction.serializeMessage()),
    )

    const signerSignature = await this.lambdaService.blockchainSignSolMessage(
      signerId,
      Uint8Array.from(transaction.serializeMessage()),
    )

    transaction.addSignature(walletPubKey, Buffer.from(walletSignature))
    transaction.addSignature(signerPubKey, Buffer.from(signerSignature))

    try {
      return await sendAndConfirmRawTransaction(
        this.getConnection(),
        transaction.serialize(),
        {
          ...blockhash,
          signature: base58.encode(transaction.signature as Buffer),
        },
        { skipPreflight: false, maxRetries: 20 },
      )
    } catch (err) {
      this.sentry.instance().captureException(err)
    }
    return base58.encode(Buffer.from(walletSignature))
  }

  private async createNftMetadataJson(
    passId: string,
    passHolderId: string,
    name: string,
    symbol: string,
    description: string,
    royalties: number,
    passPubKey: PublicKey,
    imageType: PassImageEnum,
    animationType?: PassAnimationEnum,
  ) {
    const imageUrl = getNftMediaUri(
      this.cloudfrontUrl,
      passId,
      passHolderId,
      imageType,
      PassSize.NORMAL,
    )

    const jsonMetadata: JsonMetadata = {
      name: name,
      symbol: symbol,
      description: description,
      seller_fee_basis_points: royalties,
      image: imageUrl,
      properties: {
        files: [
          {
            type: `image/${imageType}`,
            uri: imageUrl,
          },
        ],
        category: 'image',
        creators: [
          {
            address: passPubKey.toString(),
            share: 100,
          },
        ],
      },
    }

    if (animationType) {
      const animationUrl = getNftMediaUri(
        this.cloudfrontUrl,
        passId,
        passHolderId,
        animationType,
        PassSize.NORMAL,
      )
      jsonMetadata.external_url = animationUrl
      jsonMetadata.properties.category = 'video'
      jsonMetadata.properties.files.push({
        uri: animationUrl,
        type: `video/${animationType}`,
      })
    }

    await this.s3contentService.putObject({
      Bucket: this.nftS3Bucket,
      Body: JSON.stringify(jsonMetadata),
      Key: getNftMetadataUri(null, passId, passHolderId),
    })

    return {
      jsonMetadata,
      metadataUri: getNftMetadataUri(this.cloudfrontUrl, passId, passHolderId),
    }
  }

  async createNftPass(
    passId: string,
    passHolderId: string,
    name: string,
    symbol: string,
    description: string,
    ownerAddress: string,
    royalties: number,
    imageType: PassImageEnum,
    animationType?: PassAnimationEnum,
  ): Promise<GetSolNftResponseDto> {
    if (localMockedAwsDev()) {
      return { mintPubKey: uuid.v4(), transactionHash: '' }
    }

    const passPubKey = new PublicKey(
      await this.lambdaService.blockchainSignGetPublicAddress(
        `${SIGNER_ID_PREFIX_PASS}.${passId}`,
        ChainEnum.SOL,
      ),
    )

    const walletPubKey = new PublicKey(
      await this.lambdaService.blockchainSignGetPublicAddress(
        SOL_MASTER_WALLET_LAMBDA_KEY_ID,
        ChainEnum.SOL,
      ),
    )

    const mintPubKey = new PublicKey(
      await this.lambdaService.blockchainSignCreateAddress(
        `${SIGNER_ID_PREFIX_PASSHOLDER}.${passHolderId}`,
        ChainEnum.SOL,
      ),
    )

    const { jsonMetadata, metadataUri } = await this.createNftMetadataJson(
      passId,
      passHolderId,
      name,
      symbol,
      description,
      royalties,
      passPubKey,
      imageType,
      animationType,
    )

    const transaction = await createNftTransaction(
      this.getConnection(),
      new URL(metadataUri),
      jsonMetadata,
      0,
      new PublicKey(ownerAddress),
      mintPubKey,
      walletPubKey,
      passPubKey,
    )

    const transactionHash = await this.lambdaSignTransaction(
      transaction,
      walletPubKey,
      mintPubKey,
      `${SIGNER_ID_PREFIX_PASSHOLDER}.${passHolderId}`,
    )
    return { mintPubKey: mintPubKey.toBase58(), transactionHash }
  }

  private async createCollectionMetadataJson(
    userId: string,
    passId: string,
    name: string,
    symbol: string,
    description: string,
    walletPubKey: PublicKey,
    imageType: PassImageEnum,
    animationType?: PassAnimationEnum,
  ) {
    const username = (
      await this.dbReader<UserEntity>(UserEntity.table)
        .where({ id: userId })
        .first()
    )?.username

    const imageUrl = getCollectionMediaUri(
      this.cloudfrontUrl,
      passId,
      imageType,
      PassSize.NORMAL,
    )

    const metadataJson: JsonMetadata = {
      name,
      symbol,
      description,
      image: imageUrl,
      external_url: `https://www.passes.com/${username}`,
      seller_fee_basis_points: 0,
      properties: {
        creators: [
          {
            address: walletPubKey.toBase58(),
            share: 100,
          },
        ],
        files: [
          {
            uri: imageUrl,
            type: `image/${imageType}`,
          },
        ],
        category: 'image',
      },
    }

    if (animationType) {
      const animationUrl = getCollectionMediaUri(
        this.cloudfrontUrl,
        passId,
        animationType,
        PassSize.NORMAL,
      )
      metadataJson.external_url = animationUrl
      metadataJson.properties.category = 'video'
      metadataJson.properties.files.push({
        uri: animationUrl,
        type: `video/${animationType}`,
      })
    }

    await this.s3contentService.putObject({
      Bucket: this.nftS3Bucket,
      Body: JSON.stringify(metadataJson),
      Key: getCollectionMetadataUri(null, passId),
    })

    return getCollectionMetadataUri(this.cloudfrontUrl, passId)
  }

  async createSolNftCollection(
    userId: string,
    passId: string,
    name: string,
    symbol: string,
    description: string,
    imageType: PassImageEnum,
    animationType?: PassAnimationEnum,
  ): Promise<GetSolNftCollectionResponseDto> {
    if (localMockedAwsDev()) {
      return {
        passPubKey: new Keypair().publicKey.toBase58(),
        transactionHash: '',
      }
    }

    const walletPubKey = new PublicKey(
      await this.lambdaService.blockchainSignGetPublicAddress(
        SOL_MASTER_WALLET_LAMBDA_KEY_ID,
        ChainEnum.SOL,
      ),
    )

    const passPubKey = new PublicKey(
      await this.lambdaService.blockchainSignCreateAddress(
        `${SIGNER_ID_PREFIX_PASS}.${passId}`,
        ChainEnum.SOL,
      ),
    )

    const metadataUri = await this.createCollectionMetadataJson(
      userId,
      passId,
      name,
      symbol,
      description,
      walletPubKey,
      imageType,
      animationType,
    )

    const metadata: DataV2 = {
      name: name,
      symbol: symbol,
      uri: metadataUri,
      sellerFeeBasisPoints: 0,
      creators: [
        {
          address: walletPubKey,
          share: 100,
          verified: true,
        },
      ],
      uses: null,
      collection: null,
    }

    const transaction = await createCollectionTransaction(
      this.getConnection(),
      walletPubKey,
      passPubKey,
      metadata,
    )

    const transactionHash = await this.lambdaSignTransaction(
      transaction,
      walletPubKey,
      passPubKey,
      `${SIGNER_ID_PREFIX_PASS}.${passId}`,
    )

    return { passPubKey: passPubKey.toBase58(), transactionHash }
  }
}
