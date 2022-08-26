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
import { Inject, NotFoundException } from '@nestjs/common'
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
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  TransactionSignature,
} from '@solana/web3.js'
import base58 from 'bs58'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import * as uuid from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { LambdaService } from '../lambda/lambda.service'
import { PassHolderEntity } from '../pass/entities/pass-holder.entity'
import { S3Service } from '../s3/s3.service'
import { UserEntity } from '../user/entities/user.entity'
import { WalletEntity } from '../wallet/entities/wallet.entity'
import { ChainEnum } from '../wallet/enum/chain.enum'
import { WalletService } from '../wallet/wallet.service'
import { GetSolNftResponseDto } from './dto/get-sol-nft.dto'
import { GetSolNftCollectionResponseDto } from './dto/get-sol-nft-collection.dto'
import { BatchSolNftRefreshEntity } from './entities/batch-sol-nft-refresh.entity'
import { SolNftEntity } from './entities/sol-nft.entity'
import { SolNftCollectionEntity } from './entities/sol-nft-collection.entity'
import * as SolHelper from './sol-helper'

const SOL_MASTER_WALLET_LAMBDA_KEY_ID = 'sol-master-wallet'
const BATCH_NFT_REFRESH_CHUNK_SIZE = 500
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

export type Creator = Readonly<{
  address: PublicKey
  verified: boolean
  share: number
}>

export class SolService {
  connection: Connection
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    private readonly configService: ConfigService,

    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],

    private readonly lambdaService: LambdaService,
    private readonly s3Service: S3Service,
    private readonly walletService: WalletService,
  ) {
    this.connection = new Connection(
      (this.configService.get('alchemy.sol.https_endpoint') as string) +
        '/' +
        (this.configService.get('alchemy.sol.api_key') as string),
    )
  }

  async getBatchSolNftRefresh() {
    const batchSolNftRefresh = await this.dbReader(
      BatchSolNftRefreshEntity.table,
    )
      .select(
        'batch_sol_nft_refresh.id',
        'batch_sol_nft_refresh.last_processed_id',
      )
      .where('batch_sol_nft_refresh.last_processed_id', null)
      .orWhereNot(
        'batch_sol_nft_refresh.last_processed_id',
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
      )
      .first()
    if (batchSolNftRefresh) {
      return batchSolNftRefresh
    } else {
      const batchId = uuid.v4()
      await this.dbWriter(BatchSolNftRefreshEntity.table).insert({
        id: batchId,
        last_processed_id: null,
      })
      return {
        id: batchId,
        last_processed_id: null,
      }
    }
  }

  async processBatchSolNftRefreshChunk(
    id: string,
    lastProcessedId: string | null,
  ): Promise<void> {
    const solNftsQuery = this.dbReader(SolNftEntity.table)
      .leftJoin(PassHolderEntity.table, 'pass_holder.sol_nft_id', 'sol_nft.id')
      .leftJoin(WalletEntity.table, 'wallet.id', 'sol_nft.wallet_id')
      .select(
        'sol_nft.id as sol_nft_id',
        'sol_nft.mint_public_key',
        'pass_holder.id as pass_holder_id',
        'wallet.address as wallet_address',
      )
    if (lastProcessedId != null) {
      solNftsQuery.where('sol_nft.id', '>', lastProcessedId)
    }
    const solNfts = await solNftsQuery.limit(BATCH_NFT_REFRESH_CHUNK_SIZE)

    if (solNfts.length == 0) {
      await this.dbWriter(BatchSolNftRefreshEntity.table)
        .update(
          'batch_sol_nft_refresh.last_processed_id',
          'ffffffff-ffff-ffff-ffff-ffffffffffff',
        )
        .where('batch_sol_nft_refresh.id', id)
      return
    }
    for (let i = 0; i < solNfts.length; i++) {
      try {
        await this.refreshNftOwnership(
          solNfts[i].sol_nft_id,
          solNfts[i].pass_holder_id,
          solNfts[i].wallet_address,
          solNfts[i].mint_public_key,
        )
        await this.dbWriter(BatchSolNftRefreshEntity.table)
          .update('batch_sol_nft_refresh.last_processed_id', solNfts[i].id)
          .where('batch_sol_nft_refresh.id', id)
      } catch (err) {
        this.logger.error(
          `error refreshing solNft ${solNfts[i].id} as part of batch sol bft refresh ${id}`,
          err,
        )
      }
    }
  }

  async refreshNftOwnership(
    solNftId: string,
    passHolderId: string | null,
    walletAddress: string | null,
    mintPublicKey: string,
  ): Promise<void> {
    const owner = await this.getOwnerOfPass(
      this.connection,
      new PublicKey(mintPublicKey),
    )

    // if unowned or same owner, skip this record
    if (!owner || owner.toString() == walletAddress) {
      return
    }

    // update PassOwnership and Wallet relationships with SolNft
    const wallet = await this.walletService.findByAddress(
      owner.toString(),
      ChainEnum.SOL,
    )

    const walletId = wallet?.id || null
    const walletUserId = wallet?.userId || null

    this.dbWriter.transaction(async (trx) => {
      await trx(SolNftEntity.table)
        .update('sol_nft.wallet_id', walletId)
        .where('sol_nft.id', solNftId)
      if (passHolderId) {
        await trx(PassHolderEntity.table)
          .update('pass_holder.holder_id', walletUserId)
          .where('pass_holder.id', passHolderId)
      }
      // TODO: if pass changes ownership, remove the subscription of the previous owner
    })
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

    if (accounts.length === 0) return null
    const tokenAccount = AccountLayout.decode(accounts[0].account.data)

    return tokenAccount.owner
  }

  /**
   * Mint a new NFT given the JsonMetadata object and the URL of the file.
   * The first creator in the array should be the wallet minting the NFT.
   */
  async createNftPass(
    userId: string,
    walletId: string,
    collectionId: string,
    owner: PublicKey,
  ): Promise<GetSolNftResponseDto> {
    // TODO: find a better way to only allow admins to access this endpoint MNT-144
    const user = await this.dbReader(UserEntity.table)
      .where({ id: userId })
      .first()
    if (!user) throw new NotFoundException('User does not exist')
    if (process.env.NODE_ENV == 'dev' && !process.env.AWS_ACCESS_KEY_ID) {
      return this.createSampleNftPass(walletId, collectionId)
    }
    const solNftId = uuid.v4()
    const walletPubKey = new PublicKey(
      await this.lambdaService.blockchainSignGetPublicAddress(
        SOL_MASTER_WALLET_LAMBDA_KEY_ID,
      ),
    )
    const uses = 0
    const usesFormatted: Uses = {
      useMethod: UseMethod.Burn,
      remaining: uses,
      total: uses,
    }
    const collection = (
      await this.dbReader(SolNftCollectionEntity.table)
        .select('*')
        .where('id', collectionId)
    )[0]

    if (collection == undefined) {
      throw 'bad request, invalid collectionId'
    }
    const collectionPubKey = new PublicKey(collection.public_key)
    const jsonMetadata = {
      name: collection.name,
      symbol: collection.symbol,
      description: collection.description,
      seller_fee_basis_points: 0,
      image: collection.image_url,
      properties: {
        files: [
          {
            type: 'image/png',
            uri: collection.image_url,
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
    if (!jsonMetadata.properties)
      throw 'The metadata has to contain the properties object'
    if (
      !jsonMetadata.properties.creators ||
      jsonMetadata.properties.creators.length === 0
    )
      throw 'The metadata has to contain the creators array.'

    const s3Input = {
      Bucket: this.configService.get('s3_bucket.nft'),
      Body: JSON.stringify(jsonMetadata),
      Key: `nft/nft-${solNftId}`,
    }
    await this.s3Service.putObject(s3Input)

    const creators: Creator[] = jsonMetadata.properties.creators.map((c) => ({
      address: new PublicKey(c.address as PublicKeyInitData),
      share: c.share as number,
      verified: c.address === walletPubKey.toBase58(),
    }))

    const collectionData = {
      verified: false,
      key: collectionPubKey,
    }

    // Minting logic
    const mintPubKey = new PublicKey(
      await this.lambdaService.blockchainSignCreateAddress(`mint.${solNftId}`),
    )
    const associatedTokenAccount = await getAssociatedTokenAddress(
      mintPubKey,
      owner,
    )
    const lamports = await this.connection.getMinimumBalanceForRentExemption(
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
      await SolHelper.findMetadataPda(collectionPubKey)
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
        collectionMint: collectionPubKey,
        collection: collectionMetadataPda,
        collectionMasterEditionAccount: collectionMasterEditionPda,
      }),
    ]
    const blockhash = await this.connection.getLatestBlockhash()
    const transaction = new Transaction().add(
      ...mintInstructions,
      ...metaplexInstructions,
    )
    transaction.recentBlockhash = blockhash.blockhash
    transaction.feePayer = walletPubKey

    const walletSignature = await this.lambdaService.blockchainSignSignMessage(
      SOL_MASTER_WALLET_LAMBDA_KEY_ID,
      Uint8Array.from(transaction.serializeMessage()),
    )

    const mintSignature = await this.lambdaService.blockchainSignSignMessage(
      `mint.${solNftId}`,
      Uint8Array.from(transaction.serializeMessage()),
    )

    transaction.addSignature(walletPubKey, Buffer.from(walletSignature))
    transaction.addSignature(mintPubKey, Buffer.from(mintSignature))

    const txSignature = await sendAndConfirmRawTransaction(
      this.connection,
      transaction.serialize(),
    )

    await this.dbWriter(SolNftEntity.table).insert({
      id: solNftId,
      sol_nft_collection_id: collectionId,
      mint_public_key: mintPubKey.toString(),
      metadata_public_key: metadataPda.toString(),
      name: collection.name,
      symbol: collection.symbol,
      uri_metadata: `https://cdn.passes-staging.com/nft/nft-${solNftId}`,
      tx_signature: txSignature,
      wallet_id: walletId,
    })
    return new GetSolNftResponseDto(
      solNftId,
      mintPubKey,
      metadataPda,
      txSignature,
    )
  }

  async createSampleNftPass(
    walletId: string,
    collectionId: string,
  ): Promise<GetSolNftResponseDto> {
    const collection = (
      await this.dbReader(SolNftCollectionEntity.table)
        .select('*')
        .where('sol_nft_collection.id', collectionId)
    )[0]

    const solNftId = uuid.v4()
    const mintPubKey = uuid.v4()
    const metadataPda = uuid.v4()
    const txSignature = uuid.v4()

    await this.dbWriter(SolNftEntity.table).insert({
      id: solNftId,
      sol_nft_collection_id: collectionId,
      mint_public_key: mintPubKey,
      metadata_public_key: metadataPda,
      name: collection.name,
      symbol: collection.symbol,
      uri_metadata:
        'https://cdn.passes-staging.com/nft/nft-51dac6fb-95b4-4e25-a6e9-f8ce3f527811',
      tx_signature: txSignature,
      wallet_id: walletId,
    })
    return new GetSolNftResponseDto(
      solNftId,
      mintPubKey,
      metadataPda,
      txSignature,
    )
  }

  async createNftCollection(
    userId: string,
    name: string,
    symbol: string,
    description: string,
    imageUrl: string,
  ): Promise<GetSolNftCollectionResponseDto> {
    // TODO: find a better way to only allow admins to access this endpoint MNT-144
    const user = await this.dbReader(UserEntity.table)
      .where({ id: userId })
      .first()
    const collectionId = uuid.v4()
    let walletPubKey: PublicKey | undefined = undefined
    let collectionPubKey: PublicKey | undefined = undefined
    let wallet: Keypair | undefined = undefined
    let collection: Keypair | undefined = undefined
    let metadata: DataV2 | undefined = undefined
    let metadataUri: string | undefined = undefined
    if (process.env.NODE_ENV == 'dev' && !process.env.AWS_ACCESS_KEY_ID) {
      wallet = Keypair.fromSecretKey(
        base58.decode(SOL_DEV_NFT_MASTER_WALLET_PRIVATE_KEY),
      )
      walletPubKey = wallet.publicKey
      collection = Keypair.generate()
      collectionPubKey = collection.publicKey
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
        ),
      )
      collectionPubKey = new PublicKey(
        await this.lambdaService.blockchainSignCreateAddress(
          `collection.${collectionId}`,
        ),
      )

      const metadataJson = {
        name: name,
        symbol: symbol,
        description: description,
        image: imageUrl,
        external_url: `https://www.passes.com/${user.username}`,
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
        Bucket: `passes-stage-nft`,
        Body: JSON.stringify(metadataJson),
        Key: `nft/collection-${collectionId}`,
      }
      metadataUri = `https://cdn.passes-staging.com/nft/collection-${collectionId}`

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
      await this.s3Service.putObject(s3Input)
    }
    // Minting logic
    const associatedTokenAccount = await getAssociatedTokenAddress(
      collectionPubKey,
      walletPubKey,
    )
    const lamports = await this.connection.getMinimumBalanceForRentExemption(
      MINT_SIZE,
    )

    // 1 - Creating a new Mint with ATA for the owner
    const mintInstructions: TransactionInstruction[] = [
      SystemProgram.createAccount({
        fromPubkey: walletPubKey,
        newAccountPubkey: collectionPubKey,
        lamports: lamports,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        collectionPubKey,
        0,
        walletPubKey,
        walletPubKey,
        TOKEN_PROGRAM_ID,
      ),
      createAssociatedTokenAccountInstruction(
        walletPubKey,
        associatedTokenAccount,
        walletPubKey,
        collectionPubKey,
      ),
      createMintToInstruction(
        collectionPubKey,
        associatedTokenAccount,
        walletPubKey,
        1,
      ),
    ]
    // 2 - Calling metaplex instruction to initiate a new NFT
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [metadataPda, _metadataPdaBump] = await SolHelper.findMetadataPda(
      collectionPubKey,
    )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [masterEditionPda, masterEditionPdaBump] =
      await SolHelper.findMasterEditionV2Pda(collectionPubKey)

    const metaplexInstructions: TransactionInstruction[] = [
      createCreateMetadataAccountV2Instruction(
        {
          metadata: metadataPda,
          mint: collectionPubKey,
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
          mint: collectionPubKey,
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
    const blockhash = await this.connection.getLatestBlockhash()
    const transaction = new Transaction().add(
      ...mintInstructions,
      ...metaplexInstructions,
    )
    transaction.recentBlockhash = blockhash.blockhash
    transaction.feePayer = walletPubKey

    let txSignature: undefined | TransactionSignature = undefined
    if (process.env.NODE_ENV == 'dev' && !process.env.AWS_ACCESS_KEY_ID) {
      txSignature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [wallet as Keypair, collection as Keypair],
      )
    } else {
      const walletSignature =
        await this.lambdaService.blockchainSignSignMessage(
          SOL_MASTER_WALLET_LAMBDA_KEY_ID,
          Uint8Array.from(transaction.serializeMessage()),
        )

      const collectionSignature =
        await this.lambdaService.blockchainSignSignMessage(
          `collection.${collectionId}`,
          Uint8Array.from(transaction.serializeMessage()),
        )

      transaction.addSignature(walletPubKey, Buffer.from(walletSignature))
      transaction.addSignature(
        collectionPubKey,
        Buffer.from(collectionSignature),
      )

      txSignature = await sendAndConfirmRawTransaction(
        this.connection,
        transaction.serialize(),
      )
    }

    await this.dbWriter(SolNftCollectionEntity.table).insert({
      id: collectionId,
      name: name,
      symbol: symbol,
      description: description,
      uri_metadata: metadataUri,
      image_url: imageUrl,
      public_key: collectionPubKey.toString(),
      tx_signature: txSignature,
    })

    return new GetSolNftCollectionResponseDto(
      collectionId,
      collectionPubKey,
      txSignature,
    )
  }
}
