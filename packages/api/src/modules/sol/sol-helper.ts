import { PROGRAM_ID as METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata'
import { PublicKey } from '@solana/web3.js'

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

// PDA function
export async function findMetadataPda(
  mint: PublicKey,
  programId: PublicKey = METADATA_PROGRAM_ID,
): Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddress(
    [Buffer.from('metadata', 'utf8'), programId.toBuffer(), mint.toBuffer()],
    programId,
  )
}

export async function findMasterEditionV2Pda(
  mint: PublicKey,
  programId: PublicKey = METADATA_PROGRAM_ID,
): Promise<[PublicKey, number]> {
  return findEditionPda(mint, programId)
}

export async function findEditionPda(
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

export async function findCollectionAuthorityRecordPda(
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

export async function findUseAuthorityRecordPda(
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
