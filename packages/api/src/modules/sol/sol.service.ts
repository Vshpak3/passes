import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import {
  createCreateMasterEditionV3Instruction,
  createCreateMetadataAccountV2Instruction,
  createVerifyCollectionInstruction,
  DataV2,
  UseMethod,
  Uses,
} from '@metaplex-foundation/mpl-token-metadata'
import { NotFoundException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
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
import { isString } from 'lodash'
import * as uuid from 'uuid'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { getAwsConfig } from '../../util/aws.util'
import { LambdaService } from '../lambda/lambda.service'
import { UserEntity } from '../user/entities/user.entity'
import { GetSolNftDto } from './dto/get-sol-nft.dto'
import { GetSolNftCollectionDto } from './dto/get-sol-nft-collection.dto'
import * as SolHelper from './sol-helper'

const SOL_MASTER_WALLET_LAMBDA_KEY_ID = 'sol-master-wallet'

const SOL_DEV_NFT_MASTER_WALLET_PRIVATE_KEY =
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
  s3Client: S3Client
  constructor(
    private readonly configService: ConfigService,

    @Database('ReadOnly')
    private readonly ReadOnlyDatabaseService: DatabaseService,
    @Database('ReadWrite')
    private readonly ReadWriteDatabaseService: DatabaseService,

    private readonly lambdaService: LambdaService,
  ) {
    this.connection = new Connection(
      this.configService.get('alchemy.sol_https_endpoint') as string,
    )
    this.s3Client = new S3Client(getAwsConfig(this.configService))
  }

  /**
   * Mint a new NFT given the JsonMetadata object and the URL of the file.
   * The first creator in the array should be the wallet minting the NFT.
   */
  async createNftPass(
    userId: string,
    owner: PublicKey,
    collectionId: string,
  ): Promise<GetSolNftDto> {
    const { knex } = this.ReadWriteDatabaseService
    // TODO: find a better way to only allow admins to access this endpoint MNT-144
    const user = await knex(UserEntity.table).where({ id: userId }).first()
    if (!user) throw new NotFoundException('User does not exist')
    if (!user.email.endsWith('@moment.vip')) {
      throw new UnauthorizedException('this endpoint is not accessible')
    }
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
      await knex('sol_nft_collection').select('*').where('id', collectionId)
    )[0]

    if (collection == undefined) {
      throw 'bad request, invalid collectionId'
    }
    const collectionPubKey = new PublicKey(collection.public_key)
    const solNftId = uuid.v4()
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
    await this.s3Client.send(new PutObjectCommand(s3Input))

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

    await knex('sol_nft').insert({
      id: solNftId,
      sol_nft_collection_id: collectionId,
      mint_public_key: mintPubKey.toString(),
      metadata_public_key: metadataPda.toString(),
      name: 'Moment PASS',
      symbol: 'MoP',
      uri_metadata: `https://cdn.passes-staging.com/nft/nft-${solNftId}`,
      tx_signature: txSignature,
    })
    return new GetSolNftDto(solNftId, mintPubKey, metadataPda, txSignature)
  }

  async createNftCollection(
    userOrUserId: string | UserEntity,
    name: string,
    symbol: string,
    description: string,
    imageUrl: string,
  ): Promise<GetSolNftCollectionDto> {
    const { knex } = this.ReadWriteDatabaseService
    // TODO: find a better way to only allow admins to access this endpoint MNT-144
    let user: undefined | UserEntity
    if (isString(userOrUserId)) {
      user = (await knex(UserEntity.table)
        .where({ id: userOrUserId })
        .first()) as UserEntity
    } else {
      user = userOrUserId
    }
    if (!user.email.endsWith('@moment.vip')) {
      throw new UnauthorizedException('this endpoint is not accessible')
    }

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
      await this.s3Client.send(new PutObjectCommand(s3Input))
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

    await knex('sol_nft_collection').insert({
      id: collectionId,
      name: name,
      symbol: symbol,
      description: description,
      uri_metadata: metadataUri,
      image_url: imageUrl,
      public_key: collectionPubKey.toString(),
      tx_signature: txSignature,
    })

    return new GetSolNftCollectionDto(
      collectionId,
      collectionPubKey,
      txSignature,
    )
  }
}
