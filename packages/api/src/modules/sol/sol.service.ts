import {
  createCreateMasterEditionV3Instruction,
  createCreateMetadataAccountV2Instruction,
  createVerifyCollectionInstruction,
  PROGRAM_ID as METADATA_PROGRAM_ID,
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
  Keypair,
  PublicKey,
  PublicKeyInitData,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'
import bs58 from 'bs58'
import * as uuid from 'uuid'

import { UserEntity } from '../user/entities/user.entity'
import { GetSolNftDto } from './dto/get-sol-nft.dto'
import { GetSolNftCollectionDto } from './dto/get-sol-nft-collection.dto'

const REMOVE_ME_SOL_NFT_MASTER_WALLET_PRIVATE_KEY =
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
  connection
  constructor(
    private readonly configService: ConfigService,

    private readonly em: EntityManager,

    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
  ) {
    this.connection = new Connection(
      configService.get('alchemy.sol_https_endpoint') as string,
    )
  }

  /**
   * Mint a new NFT given the JsonMetadata object and the URL of the file.
   * The first creator in the array should be the wallet minting the NFT.
   */
  async createNftPass(
    userId: string,
    UriMetadata: URL,
    owner: PublicKey,
    collectionId: string,
  ): Promise<GetSolNftDto> {
    // TODO: find a better way to only allow admins to access this endpoint https://buildmoment.atlassian.net/browse/MNT-144
    const user = await this.userRepository.findOneOrFail(userId)
    if (!user.email.endsWith('@moment.vip')) {
      throw new UnauthorizedException('this endpoint is not accessible')
    }
    const wallet = Keypair.fromSecretKey(
      bs58.decode(REMOVE_ME_SOL_NFT_MASTER_WALLET_PRIVATE_KEY),
    )
    const uses = 0
    const JsonMetadata = {
      name: 'Moment PASS',
      symbol: 'MoP',
      description:
        'Deep in the heart of Dingus Forest echoes the sleepless cries of a troop of 10,000 apes. These aren’t just regular apes, however. These are degenerate apes.',
      seller_fee_basis_points: 0,
      external_url: '',
      properties: {
        category: 'image',
        creators: [
          {
            address: wallet.publicKey.toString(),
            share: 100,
          },
        ],
      },
      image: 'https://arweave.net/-ZD0iaPP8mrSA3__INLy0-M8qizmMKr1RndhHTWpPoQ',
    }
    const usesFormatted: Uses = {
      useMethod: UseMethod.Burn,
      remaining: uses,
      total: uses,
    }
    const knex = this.em.getKnex()
    const collectionPubKeyStr = (
      await knex('sol_nft_collection')
        .select('sol_nft_collection.public_key as public_key')
        .where('id', collectionId)
    )[0]?.public_key

    const collectionPubKey = new PublicKey(collectionPubKeyStr)

    if (collectionPubKey == undefined) {
      throw 'bad request, invalid collectionId'
    }

    if (!JsonMetadata.properties)
      throw 'The metadata has to contain the properties object'
    if (
      !JsonMetadata.properties.creators ||
      JsonMetadata.properties.creators.length === 0
    )
      throw 'The metadata has to contain the creators array.'

    const creators: Creator[] = JsonMetadata.properties.creators.map((c) => ({
      address: new PublicKey(c.address as PublicKeyInitData),
      share: c.share as number,
      verified: c.address === wallet.publicKey.toBase58(),
    }))

    const collectionData = {
      verified: false,
      key: collectionPubKey,
    }

    // Minting logic
    const mint = Keypair.generate()
    const payer = wallet
    const updateAuthority = wallet
    const mintAuthority = wallet
    const freezeAuthority = wallet.publicKey
    const associatedTokenAccount = await getAssociatedTokenAddress(
      mint.publicKey,
      owner,
    )
    const lamports = await this.connection.getMinimumBalanceForRentExemption(
      MINT_SIZE,
    )

    // 1 - Creating a new Mint with ATA for the owner
    const mintInstructions: TransactionInstruction[] = [
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mint.publicKey,
        lamports: lamports,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        mint.publicKey,
        0,
        mintAuthority.publicKey,
        freezeAuthority,
        TOKEN_PROGRAM_ID,
      ),
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        associatedTokenAccount,
        owner,
        mint.publicKey,
      ),
      createMintToInstruction(
        mint.publicKey,
        associatedTokenAccount,
        mintAuthority.publicKey,
        1,
      ),
    ]

    // 2 - Calling metaplex instruction to initiate a new NFT
    const metadataPda = (await this.findMetadataPda(mint.publicKey))[0]
    const masterEditionPda = (
      await this.findMasterEditionV2Pda(mint.publicKey)
    )[0]
    const collectionMetadataPda = (
      await this.findMetadataPda(collectionPubKey)
    )[0]
    const collectionMasterEditionPda = (
      await this.findMasterEditionV2Pda(mint.publicKey)
    )[0]

    const metaplexInstructions: TransactionInstruction[] = [
      createCreateMetadataAccountV2Instruction(
        {
          metadata: metadataPda,
          mint: mint.publicKey,
          mintAuthority: mintAuthority.publicKey,
          payer: wallet.publicKey,
          updateAuthority: updateAuthority.publicKey,
        },
        {
          createMetadataAccountArgsV2: {
            data: {
              name: JsonMetadata.name ?? '',
              symbol: JsonMetadata.symbol ?? '',
              uri: UriMetadata.href,
              sellerFeeBasisPoints: JsonMetadata.seller_fee_basis_points ?? 0,
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
          mint: mint.publicKey,
          updateAuthority: updateAuthority.publicKey,
          mintAuthority: mintAuthority.publicKey,
          payer: payer.publicKey,
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
        collectionAuthority: wallet.publicKey,
        payer: wallet.publicKey,
        collectionMint: collectionPubKey,
        collection: collectionMetadataPda,
        collectionMasterEditionAccount: collectionMasterEditionPda,
      }),
    ]

    const transaction = new Transaction().add(
      ...mintInstructions,
      ...metaplexInstructions,
    )
    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [wallet, mint],
      { skipPreflight: true },
    )

    const solNftId = uuid.v4()
    await knex('sol_nft').insert({
      id: solNftId,
      sol_nft_collection_id: collectionId,
      mint_public_key: mint.publicKey.toString(),
      metadata_public_key: metadataPda.toString(),
      name: 'Moment PASS',
      symbol: 'MoP',
      uri_metadata: UriMetadata.href,
      tx_signature: signature,
      created_at: new Date(),
      updated_at: new Date(),
    })
    return new GetSolNftDto(
      solNftId,
      mint.publicKey,
      bs58.encode(mint.secretKey),
      metadataPda,
      signature,
    )
  }

  async createNftCollection(
    userId: string,
    name: string,
    symbol: string,
    uriMetadata: URL,
  ): Promise<GetSolNftCollectionDto> {
    // TODO: find a better way to only allow admins to access this endpoint https://buildmoment.atlassian.net/browse/MNT-144
    const user = await this.userRepository.findOneOrFail(userId)
    if (!user.email.endsWith('@moment.vip')) {
      throw new UnauthorizedException('this endpoint is not accessible')
    }

    const wallet = Keypair.fromSecretKey(
      bs58.decode(REMOVE_ME_SOL_NFT_MASTER_WALLET_PRIVATE_KEY),
    )
    const collection = Keypair.generate()
    // Minting logic
    const payer = wallet
    const updateAuthority = wallet
    const mintAuthority = wallet
    const freezeAuthority = wallet.publicKey
    const associatedTokenAccount = await getAssociatedTokenAddress(
      collection.publicKey,
      wallet.publicKey,
    )
    const lamports = await this.connection.getMinimumBalanceForRentExemption(
      MINT_SIZE,
    )

    // 1 - Creating a new Mint with ATA for the owner
    const mintInstructions: TransactionInstruction[] = [
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: collection.publicKey,
        lamports: lamports,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        collection.publicKey,
        0,
        mintAuthority.publicKey,
        freezeAuthority,
        TOKEN_PROGRAM_ID,
      ),
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        associatedTokenAccount,
        wallet.publicKey,
        collection.publicKey,
      ),
      createMintToInstruction(
        collection.publicKey,
        associatedTokenAccount,
        mintAuthority.publicKey,
        1,
      ),
    ]

    // 2 - Calling metaplex instruction to initiate a new NFT
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [metadataPda, _metadataPdaBump] = await this.findMetadataPda(
      collection.publicKey,
    )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [masterEditionPda, masterEditionPdaBump] =
      await this.findMasterEditionV2Pda(collection.publicKey)

    const metaplexInstructions: TransactionInstruction[] = [
      createCreateMetadataAccountV2Instruction(
        {
          metadata: metadataPda,
          mint: collection.publicKey,
          mintAuthority: mintAuthority.publicKey,
          payer: wallet.publicKey,
          updateAuthority: updateAuthority.publicKey,
        },
        {
          createMetadataAccountArgsV2: {
            data: {
              name: name ?? '',
              symbol: symbol ?? '',
              uri: uriMetadata.href,
              sellerFeeBasisPoints: 0,
              creators: [
                { address: wallet.publicKey, share: 100, verified: true },
              ],
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
          mint: collection.publicKey,
          updateAuthority: updateAuthority.publicKey,
          mintAuthority: mintAuthority.publicKey,
          payer: payer.publicKey,
          metadata: metadataPda,
        },
        {
          createMasterEditionArgs: {
            maxSupply: 0,
          },
        },
      ),

      // TODO: determine if we want to distribute royalties on-chain via the creators array
      // createSignMetadataInstruction({
      //   creator: collection.publicKey,
      //   metadata: metadataPda
      // })
    ]

    const transaction = new Transaction().add(
      ...mintInstructions,
      ...metaplexInstructions,
    )

    const knex = this.em.getKnex()

    const txSignature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [wallet, collection],
      { skipPreflight: true },
    )

    const collectionId = uuid.v4()
    await knex('sol_nft_collection').insert({
      id: collectionId,
      name: name,
      symbol: symbol,
      uri_metadata: uriMetadata.href,
      public_key: collection.publicKey.toString(),
      tx_signature: txSignature,
      created_at: new Date(),
      updated_at: new Date(),
    })

    return new GetSolNftCollectionDto(
      collectionId,
      collection.publicKey,
      bs58.encode(collection.secretKey),
      txSignature,
    )
  }

  // PDA function
  async findMetadataPda(
    mint: PublicKey,
    programId: PublicKey = METADATA_PROGRAM_ID,
  ): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddress(
      [Buffer.from('metadata', 'utf8'), programId.toBuffer(), mint.toBuffer()],
      programId,
    )
  }

  async findMasterEditionV2Pda(
    mint: PublicKey,
    programId: PublicKey = METADATA_PROGRAM_ID,
  ): Promise<[PublicKey, number]> {
    return this.findEditionPda(mint, programId)
  }

  async findEditionPda(
    mint: PublicKey,
    programId: PublicKey = METADATA_PROGRAM_ID,
  ): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddress(
      [
        Buffer.from('metadata', 'utf8'),
        programId.toBuffer(),
        mint.toBuffer(),
        Buffer.from('edition', 'utf8'),
      ],
      programId,
    )
  }

  async findCollectionAuthorityRecordPda(
    mint: PublicKey,
    collectionAuthority: PublicKey,
    programId: PublicKey = METADATA_PROGRAM_ID,
  ): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddress(
      [
        Buffer.from('metadata', 'utf8'),
        programId.toBuffer(),
        mint.toBuffer(),
        Buffer.from('collection_authority', 'utf8'),
        collectionAuthority.toBuffer(),
      ],
      programId,
    )
  }

  async findUseAuthorityRecordPda(
    mint: PublicKey,
    useAuthority: PublicKey,
    programId: PublicKey = METADATA_PROGRAM_ID,
  ): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddress(
      [
        Buffer.from('metadata', 'utf8'),
        programId.toBuffer(),
        mint.toBuffer(),
        Buffer.from('user', 'utf8'),
        useAuthority.toBuffer(),
      ],
      programId,
    )
  }
}
