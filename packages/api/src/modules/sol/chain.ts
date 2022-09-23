import {
  Collection,
  createCreateMasterEditionV3Instruction,
  createCreateMetadataAccountV2Instruction,
  createVerifyCollectionInstruction,
  DataV2,
  UseMethod,
  Uses,
} from '@metaplex-foundation/mpl-token-metadata'
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
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'

import { JsonMetadata } from './json-metadata.interface'
import { findMasterEditionV2Pda, findMetadataPda } from './pda-helper'
import { Creator } from './types'

// /**
//  * Helper function to create a metadata file given the different data of the NFT.
//  * By default, the royalties will be 0. It can overriden with the last parameter.
//  * By default, momentPubkey hold 100% of the royalties.
//  */
// export const createMetadataFile = (
//   // Moment field
//   momentPubkey: PublicKey,
//   creatorPubkey: PublicKey,
//   // Default field
//   name: string,
//   symbol: string,
//   description: string,
//   image: URL,
//   momentWebsite: URL,

//   collectionName: string,
//   collectionFamily: string,

//   seller_fee_basis_points = 0,
// ): JsonMetadata => {
//   const creators = [
//     {
//       address: momentPubkey.toBase58(),
//       share: 100,
//     },
//     {
//       address: creatorPubkey.toBase58(),
//       share: 0,
//     },
//   ]

//   return {
//     name,
//     symbol,
//     description,
//     image: image.href,
//     external_url: momentWebsite.href,
//     seller_fee_basis_points,
//     properties: {
//       creators,
//     },
//     collection: {
//       name: collectionName,
//       family: collectionFamily,
//     },
//   }
// }

/**
 * Create a collection, which is represented as an NFT.
 * It is recommended to create a collection if you want to regroup NFTs together.
 */
export const createCollectionTransaction = async (
  connection: Connection,
  walletPubKey: PublicKey,
  collectionPubKey: PublicKey,
  metadata: DataV2,
): Promise<Transaction> => {
  // Minting logic
  const payer = walletPubKey
  const updateAuthority = walletPubKey
  const mintAuthority = walletPubKey
  const freezeAuthority = walletPubKey

  const associatedTokenAccount = await getAssociatedTokenAddress(
    collectionPubKey,
    walletPubKey,
  )
  const lamports = await connection.getMinimumBalanceForRentExemption(MINT_SIZE)

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
      mintAuthority,
      freezeAuthority,
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
      mintAuthority,
      1,
    ),
  ]

  // 2 - Calling metaplex instruction to initiate a new NFT
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [metadataPda, _metadataPdaBump] = await findMetadataPda(
    collectionPubKey,
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [masterEditionPda, masterEditionPdaBump] = await findMasterEditionV2Pda(
    collectionPubKey,
  )

  const metaplexInstructions: TransactionInstruction[] = [
    createCreateMetadataAccountV2Instruction(
      {
        metadata: metadataPda,
        mint: collectionPubKey,
        mintAuthority: mintAuthority,
        payer: walletPubKey,
        updateAuthority: updateAuthority,
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
        updateAuthority: updateAuthority,
        mintAuthority: mintAuthority,
        payer: payer,
        metadata: metadataPda,
      },
      {
        createMasterEditionArgs: {
          maxSupply: 0,
        },
      },
    ),
  ]

  return new Transaction().add(...mintInstructions, ...metaplexInstructions)
}

/**
 * Mint a new NFT given the JsonMetadata object and the URL of the file.
 * The first creator in the array should be the wallet minting the NFT.
 */
export const createNftTransaction = async (
  connection: Connection,
  UriMetadata: URL,
  JsonMetadata: JsonMetadata,
  uses: number,
  owner: PublicKey,
  mintPubKey: PublicKey,
  walletPubKey: PublicKey,
  collectionPubKey: PublicKey,
): Promise<Transaction> => {
  const usesFormatted: Uses = {
    useMethod: UseMethod.Burn,
    remaining: uses,
    total: uses,
  }

  if (
    !JsonMetadata.properties ||
    !JsonMetadata.properties.creators ||
    JsonMetadata.properties.creators.length === 0
  ) {
    throw 'The metadata has to contain the creators array.'
  }

  const creators: Creator[] = JsonMetadata.properties.creators.map((c) => ({
    address: new PublicKey(c.address as PublicKeyInitData),
    share: c.share as number,
    verified: c.address === walletPubKey.toBase58(),
  }))

  const collectionData: Collection = {
    verified: false,
    key: collectionPubKey,
  }

  // Minting logic
  const payer = walletPubKey
  const updateAuthority = walletPubKey
  const mintAuthority = walletPubKey
  const freezeAuthority = walletPubKey

  const associatedTokenAccount = await getAssociatedTokenAddress(
    mintPubKey,
    owner,
  )
  const lamports = await connection.getMinimumBalanceForRentExemption(MINT_SIZE)

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
      mintAuthority,
      freezeAuthority,
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
      mintAuthority,
      1,
    ),
  ]

  // 2 - Calling metaplex instruction to initiate a new NFT
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [metadataPda, metadataPdaBump] = await findMetadataPda(mintPubKey)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [masterEditionPda, masterEditionPdaBump] = await findMasterEditionV2Pda(
    mintPubKey,
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [collectionMetadataPda, collectionMetadataPdaBump] =
    await findMetadataPda(collectionPubKey)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [collectionMasterEditionPda, collectionMasterEditionPdaBump] =
    await findMasterEditionV2Pda(mintPubKey)

  const metaplexInstructions: TransactionInstruction[] = [
    createCreateMetadataAccountV2Instruction(
      {
        metadata: metadataPda,
        mint: mintPubKey,
        mintAuthority: mintAuthority,
        payer: payer,
        updateAuthority: updateAuthority,
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
        mint: mintPubKey,
        updateAuthority: updateAuthority,
        mintAuthority: mintAuthority,
        payer: payer,
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

  return new Transaction().add(...mintInstructions, ...metaplexInstructions)
}

// /**
//  * Retrieve the owner of a given pass using getProgramAccounts on the token program.
//  */
// export const getOwnerOfPass = async (
//   connection: Connection,
//   passMint: PublicKey,
// ): Promise<null | PublicKey> => {
//   const amount = Buffer.alloc(8)
//   amount.writeBigUInt64LE(BigInt(1))

//   const accounts = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
//     filters: [
//       {
//         dataSize: ACCOUNT_SIZE,
//       },
//       {
//         memcmp: {
//           offset: 0,
//           bytes: passMint.toBase58(),
//         },
//       },
//       {
//         memcmp: {
//           offset: 64,
//           bytes: bs58.encode(amount),
//         },
//       },
//     ],
//   })

//   if (accounts.length === 0) {
//     return null
//   }
//   const tokenAccount = AccountLayout.decode(accounts[0].account.data)

//   return tokenAccount.owner
// }

// /**
//  * Retrieve all the NFTs of a given user.
//  * This function make 2 heavy calls on the RPC servers. Use with care.
//  */
// export const getPassOfOwner = async (
//   connection: Connection,
//   owner: PublicKey,
//   creator: PublicKey,
// ): Promise<PublicKey[]> => {
//   const amount = Buffer.alloc(8)
//   amount.writeBigUInt64LE(BigInt(1))

//   const accounts = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
//     filters: [
//       {
//         dataSize: ACCOUNT_SIZE,
//       },
//       {
//         memcmp: {
//           offset: 32,
//           bytes: owner.toBase58(),
//         },
//       },
//       {
//         memcmp: {
//           offset: 64,
//           bytes: bs58.encode(amount),
//         },
//       },
//     ],
//   })

//   const metadatas = await connection.getProgramAccounts(METADATA_PROGRAM_ID, {
//     dataSlice: { offset: 33, length: 32 },
//     filters: [
//       {
//         memcmp: {
//           offset:
//             1 +
//             32 +
//             32 +
//             4 +
//             MAX_NAME_LENGTH +
//             4 +
//             MAX_URI_LENGTH +
//             4 +
//             MAX_SYMBOL_LENGTH +
//             2 +
//             1 +
//             4,
//           bytes: creator.toBase58(),
//         },
//       },
//     ],
//   })

//   if (accounts.length === 0 || metadatas.length === 0) {
//     return []
//   }

//   const mints = metadatas.map((m) => bs58.encode(m.account.data))
//   const tokenAccounts = accounts.map((a) =>
//     AccountLayout.decode(a.account.data),
//   )

//   return tokenAccounts
//     .filter((t) => mints.includes(t.mint.toBase58()))
//     .map((t) => t.mint)
// }
