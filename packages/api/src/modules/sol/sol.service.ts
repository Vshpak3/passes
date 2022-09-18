// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */
import {
  createCreateMasterEditionV3Instruction,
  createCreateMetadataAccountV2Instruction,
  createVerifyCollectionInstruction,
  DataV2,
  UseMethod,
  Uses,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  Inject,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  ACCOUNT_SIZE,
  AccountLayout,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import {
  Connection,
  Keypair,
  PublicKey,
  PublicKeyInitData,
  sendAndConfirmRawTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'
import base58 from 'bs58'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import * as uuid from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { localMockedAwsDev } from '../../util/aws.util'
import { ContentFormatEnum } from '../content/enums/content-format.enum'
import { LambdaService } from '../lambda/lambda.service'
import { PassHolderEntity } from '../pass/entities/pass-holder.entity'
import { RedisLockService } from '../redis-lock/redis-lock.service'
import { S3ContentService } from '../s3content/s3content.service'
import { UserEntity } from '../user/entities/user.entity'
import { WalletEntity } from '../wallet/entities/wallet.entity'
import { ChainEnum } from '../wallet/enum/chain.enum'
import { WalletService } from '../wallet/wallet.service'
import { GetSolNftResponseDto } from './dto/get-sol-nft.dto'
import { GetSolNftCollectionResponseDto } from './dto/get-sol-nft-collection.dto'
import * as SolHelper from './sol-helper'

const SOL_MASTER_WALLET_LAMBDA_KEY_ID = 'sol-master-wallet'
export const SOL_DEV_NFT_MASTER_WALLET_PRIVATE_KEY =
  '3HYQhGSwsYuRx3Kvzg9g6EKrjWrLTY4SKzrGboRzsjg1AkjCBrPHZn9DZxHkxkoe7YWxAqw1XUVfaQnw7NXegA2h'

export interface JsonMetadata<Uri = string> {
  name?: string
  symbol?: string
  description?: string
  seller_fee_basis_points?: number
  image?: Uri
  external_url?: Uri
  attributes?: JsonMetadataAttribute[]
  properties?: JsonMetadataProperties<Uri>
  collection?: {
    name?: string
    family?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}
export interface JsonMetadataAttribute {
  trait_type?: string
  value?: string
  [key: string]: unknown
}
export interface JsonMetadataProperties<Uri> {
  creators?: JsonMetadataCreator[]
  files?: JsonMetadataFile<Uri>[]
  [key: string]: unknown
}
export interface JsonMetadataCreator {
  address?: string
  share?: number
  [key: string]: unknown
}
export interface JsonMetadataFile<Uri = string> {
  type?: string
  uri?: Uri
  [key: string]: unknown
}

type Creator = Readonly<{
  address: PublicKey
  verified: boolean
  share: number
}>

const MAX_TIME_NFT_REFRESH = 1000 * 60 * 30 // 30 minutes

export class SolService {
  cloudfrontUrl: string
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    private readonly configService: ConfigService,

    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],

    private readonly lambdaService: LambdaService,
    private readonly s3contentService: S3ContentService,
    private readonly walletService: WalletService,
    @Inject(RedisLockService)
    protected readonly lockService: RedisLockService,
  ) {
    this.cloudfrontUrl = configService.get('cloudfront.baseUrl') as string
  }

  async getConnection() {
    return new Connection(
      (this.configService.get('alchemy.sol.https_endpoint') as string) +
        '/' +
        (this.configService.get('alchemy.sol.api_key') as string),
    )
  }

  async refreshSolNfts() {
    const passholders = await this.dbReader(PassHolderEntity.table)
      .where(
        PassHolderEntity.toDict<PassHolderEntity>({
          chain: ChainEnum.SOL,
        }),
      )
      .select(['address', 'id'])
    // run synchronously to avoid throttling
    // its fine that its done slowly
    const connection = await this.getConnection()
    for (let i = 0; i < passholders.length; ++i) {
      try {
        await this.refreshSolNft(
          passholders[i].id,
          passholders[i].address,
          true,
          connection,
        )
      } catch (err) {
        this.logger.error(`failed sol nft refresh ${passholders[i].id}`, err)
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
      const wallet = await this.dbReader(WalletEntity.table)
        .where(
          WalletEntity.toDict<WalletEntity>({
            chain: ChainEnum.SOL,
            address: walletAddress,
            authenticated: true,
          }),
        )
        .select(['id', 'user_id'])
        .first()
      if (wallet) {
        await this.dbWriter(PassHolderEntity.table)
          .where(
            PassHolderEntity.toDict<PassHolderEntity>({
              id: passHolderId,
            }),
          )
          .update(
            PassHolderEntity.toDict<PassHolderEntity>({
              wallet: wallet.id,
              holder: wallet.user_id,
            }),
          )
      }
    }
  }

  /**
   * Retrieve the owner of a given pass using getProgramAccounts on the token program.
   */
  async getOwnerOfPass(
    connection: Connection,
    passMint: PublicKey,
  ): Promise<null | PublicKey> {
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

  /**
   * Mint a new NFT given the JsonMetadata object and the URL of the file.
   * The first creator in the array should be the wallet minting the NFT.
   */
  async createNftPass(
    userId: string,
    passId: string,
    passHolderId: string,
    name: string,
    symbol: string,
    description: string,
    ownerAddress: string,
  ): Promise<GetSolNftResponseDto> {
    const connection = await this.getConnection()
    const user = await this.dbReader(UserEntity.table)
      .where({ id: userId })
      .first()
    if (!user) {
      throw new NotFoundException('User does not exist')
    }
    if (localMockedAwsDev()) {
      return { mintPubKey: uuid.v4(), transactionHash: '' }
    }
    const owner = new PublicKey(ownerAddress)
    const solNftId = uuid.v4()
    const walletPubKey = new PublicKey(
      await this.lambdaService.blockchainSignGetPublicAddress(
        SOL_MASTER_WALLET_LAMBDA_KEY_ID,
        ChainEnum.SOL,
      ),
    )
    const uses = 0
    const usesFormatted: Uses = {
      useMethod: UseMethod.Burn,
      remaining: uses,
      total: uses,
    }
    const passPubKey = new PublicKey(
      await this.lambdaService.blockchainSignCreateAddress(
        `pass.${passId}`,
        ChainEnum.SOL,
      ),
    )
    const imageUrl = `${this.cloudfrontUrl}/nft/${passId}/collection.${ContentFormatEnum.IMAGE}` //TODO: supoprt other media

    const jsonMetadata = {
      name: name,
      symbol: symbol,
      description: description,
      seller_fee_basis_points: 0,
      image: imageUrl,
      properties: {
        files: [
          {
            type: 'image/png',
            uri: imageUrl,
          },
        ],
        category: 'image',
        creators: [
          {
            address: walletPubKey.toString(),
            share: 100,
          },
        ],
      },
    }
    if (!jsonMetadata.properties) {
      throw 'The metadata has to contain the properties object'
    }
    if (
      !jsonMetadata.properties.creators ||
      jsonMetadata.properties.creators.length === 0
    ) {
      throw 'The metadata has to contain the creators array.'
    }

    const s3Input = {
      Bucket: this.configService.get('s3_bucket.nft'),
      Body: JSON.stringify(jsonMetadata),
      Key: `nft/nft-${solNftId}`,
    }
    await this.s3contentService.putObject(s3Input)

    const creators: Creator[] = jsonMetadata.properties.creators.map((c) => ({
      address: new PublicKey(c.address as PublicKeyInitData),
      share: c.share as number,
      verified: c.address === walletPubKey.toBase58(),
    }))

    const collectionData = {
      verified: false,
      key: passPubKey,
    }

    // Minting logic
    const mintPubKey = new PublicKey(
      await this.lambdaService.blockchainSignCreateAddress(
        `passholder.${passHolderId}`,
        ChainEnum.SOL,
      ),
    )
    const associatedTokenAccount = await getAssociatedTokenAddress(
      mintPubKey,
      owner,
    )
    const lamports = await connection.getMinimumBalanceForRentExemption(
      MINT_SIZE,
    )

    // 1 - Creating a new Mint with ATA for the owner
    const mintInstructions: TransactionInstruction[] = [
      SystemProgram.createAccount({
        fromPubkey: walletPubKey,
        newAccountPubkey: mintPubKey,
        lamports: lamports,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        mintPubKey,
        0,
        walletPubKey,
        walletPubKey,
        TOKEN_PROGRAM_ID,
      ),
      createAssociatedTokenAccountInstruction(
        walletPubKey,
        associatedTokenAccount,
        owner,
        mintPubKey,
      ),
      createMintToInstruction(
        mintPubKey,
        associatedTokenAccount,
        walletPubKey,
        1,
      ),
    ]

    // 2 - Calling metaplex instruction to initiate a new NFT
    const metadataPda = (await SolHelper.findMetadataPda(mintPubKey))[0]
    const masterEditionPda = (
      await SolHelper.findMasterEditionV2Pda(mintPubKey)
    )[0]
    const collectionMetadataPda = (
      await SolHelper.findMetadataPda(passPubKey)
    )[0]
    const collectionMasterEditionPda = (
      await SolHelper.findMasterEditionV2Pda(mintPubKey)
    )[0]

    const metaplexInstructions: TransactionInstruction[] = [
      createCreateMetadataAccountV2Instruction(
        {
          metadata: metadataPda,
          mint: mintPubKey,
          mintAuthority: walletPubKey,
          payer: walletPubKey,
          updateAuthority: walletPubKey,
        },
        {
          createMetadataAccountArgsV2: {
            data: {
              name: jsonMetadata.name ?? '',
              symbol: jsonMetadata.symbol ?? '',
              uri: `https://cdn.passes-staging.com/nft/nft-${solNftId}`,
              sellerFeeBasisPoints: jsonMetadata.seller_fee_basis_points ?? 0,
              creators,
              collection: collectionData,
              uses: usesFormatted,
            },
            isMutable: true,
          },
        },
      ),
      createCreateMasterEditionV3Instruction(
        {
          edition: masterEditionPda,
          mint: mintPubKey,
          updateAuthority: walletPubKey,
          mintAuthority: walletPubKey,
          payer: walletPubKey,
          metadata: metadataPda,
        },
        {
          createMasterEditionArgs: {
            maxSupply: 0,
          },
        },
      ),
      createVerifyCollectionInstruction({
        metadata: metadataPda,
        collectionAuthority: walletPubKey,
        payer: walletPubKey,
        collectionMint: passPubKey,
        collection: collectionMetadataPda,
        collectionMasterEditionAccount: collectionMasterEditionPda,
      }),
    ]
    const blockhash = await connection.getLatestBlockhash()
    const transaction = new Transaction().add(
      ...mintInstructions,
      ...metaplexInstructions,
    )
    transaction.recentBlockhash = blockhash.blockhash
    transaction.feePayer = walletPubKey

    const walletSignature = await this.lambdaService.blockchainSignSignMessage(
      SOL_MASTER_WALLET_LAMBDA_KEY_ID,
      ChainEnum.SOL,
      Uint8Array.from(transaction.serializeMessage()),
    )

    const mintSignature = await this.lambdaService.blockchainSignSignMessage(
      `mint.${solNftId}`,
      ChainEnum.SOL,
      Uint8Array.from(transaction.serializeMessage()),
    )

    transaction.addSignature(walletPubKey, Buffer.from(walletSignature))
    transaction.addSignature(mintPubKey, Buffer.from(mintSignature))

    const transactionHash = await sendAndConfirmRawTransaction(
      connection,
      transaction.serialize(),
    )

    return { mintPubKey: mintPubKey.toBase58(), transactionHash }
  }

  async createSolNftCollection(
    userId: string,
    passId: string,
    name: string,
    symbol: string,
    description: string,
  ): Promise<GetSolNftCollectionResponseDto> {
    const connection = await this.getConnection()
    // TODO: find a better way to only allow admins to access this endpoint MNT-144
    const user = await this.dbReader(UserEntity.table)
      .where({ id: userId })
      .first()
    let walletPubKey: PublicKey | undefined = undefined
    let passPubKey: PublicKey | undefined = undefined
    let wallet: Keypair | undefined = undefined
    let collection: Keypair | undefined = undefined
    let metadata: DataV2 | undefined = undefined
    let metadataUri: string | undefined = undefined
    if (localMockedAwsDev()) {
      wallet = Keypair.fromSecretKey(
        base58.decode(SOL_DEV_NFT_MASTER_WALLET_PRIVATE_KEY),
      )
      walletPubKey = wallet.publicKey
      collection = Keypair.generate()
      passPubKey = collection.publicKey
      metadataUri =
        'https://rfdufzqpc6bb3lpa4y4teg23rq6ugjn343dc2vvryobmtaam.arweave.net/iUdC5_g8Xgh2t4OY5-MhtbjD1DJbvmxi1WscOCyYAMs'
      metadata = {
        name: name,
        symbol: symbol,
        sellerFeeBasisPoints: 0,
        uri: metadataUri,
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
    } else {
      walletPubKey = new PublicKey(
        await this.lambdaService.blockchainSignGetPublicAddress(
          SOL_MASTER_WALLET_LAMBDA_KEY_ID,
          ChainEnum.SOL,
        ),
      )
      passPubKey = new PublicKey(
        await this.lambdaService.blockchainSignCreateAddress(
          `pass.${passId}`,
          ChainEnum.SOL,
        ),
      )

      const imageUrl = `${this.cloudfrontUrl}/nft/${passId}/collection.${ContentFormatEnum.IMAGE}` //TODO: supoprt other media

      const metadataJson = {
        name: name,
        symbol: symbol,
        description: description,
        image: imageUrl,
        external_url: `https://www.passes.com/${user.username}`, //TODO: (pz129) fix
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
              type: 'image/png',
            },
          ],
          category: 'image',
        },
      }
      const s3Input = {
        Bucket: 'passes-stage-nft',
        Body: JSON.stringify(metadataJson),
        Key: `nft/collection-${passId}`,
      }
      metadataUri = `${this.cloudfrontUrl}/nft/collection-${passId}`

      metadata = {
        name: name,
        symbol: symbol,
        sellerFeeBasisPoints: 0,
        uri: metadataUri,
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
      await this.s3contentService.putObject(s3Input)
    }
    // Minting logic
    const associatedTokenAccount = await getAssociatedTokenAddress(
      passPubKey,
      walletPubKey,
    )
    const lamports = await connection.getMinimumBalanceForRentExemption(
      MINT_SIZE,
    )

    // 1 - Creating a new Mint with ATA for the owner
    const mintInstructions: TransactionInstruction[] = [
      SystemProgram.createAccount({
        fromPubkey: walletPubKey,
        newAccountPubkey: passPubKey,
        lamports: lamports,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        passPubKey,
        0,
        walletPubKey,
        walletPubKey,
        TOKEN_PROGRAM_ID,
      ),
      createAssociatedTokenAccountInstruction(
        walletPubKey,
        associatedTokenAccount,
        walletPubKey,
        passPubKey,
      ),
      createMintToInstruction(
        passPubKey,
        associatedTokenAccount,
        walletPubKey,
        1,
      ),
    ]
    // 2 - Calling metaplex instruction to initiate a new NFT
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [metadataPda, _metadataPdaBump] = await SolHelper.findMetadataPda(
      passPubKey,
    )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [masterEditionPda, masterEditionPdaBump] =
      await SolHelper.findMasterEditionV2Pda(passPubKey)

    const metaplexInstructions: TransactionInstruction[] = [
      createCreateMetadataAccountV2Instruction(
        {
          metadata: metadataPda,
          mint: passPubKey,
          mintAuthority: walletPubKey,
          payer: walletPubKey,
          updateAuthority: walletPubKey,
        },
        {
          createMetadataAccountArgsV2: {
            data: metadata,
            isMutable: true,
          },
        },
      ),
      createCreateMasterEditionV3Instruction(
        {
          edition: masterEditionPda,
          mint: passPubKey,
          updateAuthority: walletPubKey,
          mintAuthority: walletPubKey,
          payer: walletPubKey,
          metadata: metadataPda,
        },
        {
          createMasterEditionArgs: {
            maxSupply: 0,
          },
        },
      ),
    ]
    const blockhash = await connection.getLatestBlockhash()
    const transaction = new Transaction().add(
      ...mintInstructions,
      ...metaplexInstructions,
    )
    transaction.recentBlockhash = blockhash.blockhash
    transaction.feePayer = walletPubKey

    if (localMockedAwsDev()) {
      return { passPubKey: passPubKey.toBase58(), transactionHash: '' }
    } else {
      const walletSignature =
        await this.lambdaService.blockchainSignSignMessage(
          SOL_MASTER_WALLET_LAMBDA_KEY_ID,
          ChainEnum.SOL,
          Uint8Array.from(transaction.serializeMessage()),
        )

      const collectionSignature =
        await this.lambdaService.blockchainSignSignMessage(
          `pass.${passId}`,
          ChainEnum.SOL,
          Uint8Array.from(transaction.serializeMessage()),
        )

      transaction.addSignature(walletPubKey, Buffer.from(walletSignature))
      transaction.addSignature(passPubKey, Buffer.from(collectionSignature))

      const transactionHash = await sendAndConfirmRawTransaction(
        connection,
        transaction.serialize(),
      )

      return { passPubKey: passPubKey.toBase58(), transactionHash }
    }
  }
}
