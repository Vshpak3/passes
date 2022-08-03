import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import {
  createCreateMasterEditionV3Instruction,
  createCreateMetadataAccountV2Instruction,
  createVerifyCollectionInstruction,
  UseMethod,
  Uses,
} from '@metaplex-foundation/mpl-token-metadata'
import { EntityManager, EntityRepository } from '@mikro-orm/mysql'
import { InjectRepository } from '@mikro-orm/nestjs'
import { UnauthorizedException } from '@nestjs/common'
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
  PublicKey,
  PublicKeyInitData,
  sendAndConfirmRawTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'
import * as uuid from 'uuid'

import { LambdaService } from '../lambda/lambda.service'
import { UserEntity } from '../user/entities/user.entity'
import { GetSolNftDto } from './dto/get-sol-nft.dto'
import { GetSolNftCollectionDto } from './dto/get-sol-nft-collection.dto'
import * as SolHelper from './sol-helper'

const SOL_MASTER_WALLET_LAMBDA_KEY_ID = 'sol-master-wallet'

// remove this when integrating with Passes API (use the cloudfront uri provided in the create request)
const PLACEHOLDER_IMAGE_URI =
  'https://explorer.solana.com/static/media/dark-solana-logo.fa522d66.svg'

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

    private readonly em: EntityManager,

    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,

    private readonly lambdaService: LambdaService,
  ) {
    this.connection = new Connection(
      configService.get('alchemy.sol_https_endpoint') as string,
    )
    this.s3Client = new S3Client({
      region: configService.get('infra.region'),
    })
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
    // TODO: find a better way to only allow admins to access this endpoint https://buildmoment.atlassian.net/browse/MNT-144
    const user = await this.userRepository.findOneOrFail(userId)
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
    const knex = this.em.getKnex()
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
      description: `${collectionId}: Deep in the heart of Dingus Forest echoes the sleepless cries of a troop of 10,000 apes. These aren't just regular apes, however. These are degenerate apes.`,
      seller_fee_basis_points: 0,
      image: PLACEHOLDER_IMAGE_URI,
      properties: {
        files: [
          {
            type: 'image/png',
            uri: PLACEHOLDER_IMAGE_URI,
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
      ACL: 'public-read',
      Bucket: 'passes-staging.com',
      Body: JSON.stringify(jsonMetadata),
      Key: `nft-${solNftId}`,
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
              uri: `https://moment-stage-public.s3.amazonaws.com/nft-${solNftId}`,
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
      uri_metadata: `https://s3.amazonaws.com/passes-staging.com/nft-${solNftId}`,
      tx_signature: txSignature,
      created_at: new Date(),
      updated_at: new Date(),
    })
    return new GetSolNftDto(solNftId, mintPubKey, metadataPda, txSignature)
  }

  async createNftCollection(
    userId: string,
    name: string,
    symbol: string,
  ): Promise<GetSolNftCollectionDto> {
    // TODO: find a better way to only allow admins to access this endpoint https://buildmoment.atlassian.net/browse/MNT-144
    const user = await this.userRepository.findOneOrFail(userId)
    if (!user.email.endsWith('@moment.vip')) {
      throw new UnauthorizedException('this endpoint is not accessible')
    }

    const walletPubKey = new PublicKey(
      await this.lambdaService.blockchainSignGetPublicAddress(
        SOL_MASTER_WALLET_LAMBDA_KEY_ID,
      ),
    )
    const collectionId = uuid.v4()
    const metadataJson = {
      name: name,
      symbol: symbol,
      description: `${collectionId}: Deep in the heart of Dingus Forest echoes the sleepless cries of a troop of 10,000 apes. These aren't just regular apes, however. These are degenerate apes.`,
      seller_fee_basis_points: 0,
      image: PLACEHOLDER_IMAGE_URI,
      properties: {
        files: [
          {
            type: 'image/png',
            uri: PLACEHOLDER_IMAGE_URI,
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
    const s3Input = {
      ACL: 'public-read',
      Bucket: 'passes-staging.com',
      Body: JSON.stringify(metadataJson),
      Key: `collection-${collectionId}`,
    }
    await this.s3Client.send(new PutObjectCommand(s3Input))
    const collectionPubKey = new PublicKey(
      await this.lambdaService.blockchainSignCreateAddress(
        `collection.${collectionId}`,
      ),
    )
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
            data: {
              name: name ?? '',
              symbol: symbol ?? '',
              uri: `https://s3.amazonaws.com/passes-staging.com/collection-${collectionId}`,
              sellerFeeBasisPoints: 0,
              creators: [{ address: walletPubKey, share: 100, verified: true }],
              collection: null,
              uses: null,
            },
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

    const knex = this.em.getKnex()

    const walletSignature = await this.lambdaService.blockchainSignSignMessage(
      'devnet-wallet',
      Uint8Array.from(transaction.serializeMessage()),
    )

    const collectionSignature =
      await this.lambdaService.blockchainSignSignMessage(
        `collection.${collectionId}`,
        Uint8Array.from(transaction.serializeMessage()),
      )

    transaction.addSignature(walletPubKey, Buffer.from(walletSignature))
    transaction.addSignature(collectionPubKey, Buffer.from(collectionSignature))

    const txSignature = await sendAndConfirmRawTransaction(
      this.connection,
      transaction.serialize(),
    )

    await knex('sol_nft_collection').insert({
      id: collectionId,
      name: name,
      symbol: symbol,
      uri_metadata: `https://s3.amazonaws.com/passes-staging.com/collection-${collectionId}`,
      public_key: collectionPubKey.toString(),
      tx_signature: txSignature,
      created_at: new Date(),
      updated_at: new Date(),
    })

    return new GetSolNftCollectionDto(
      collectionId,
      collectionPubKey,
      txSignature,
    )
  }
}
