import { PROGRAM_ID as METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata'
import { PublicKey } from '@solana/web3.js'

export const findMetadataPda = (
  mint: PublicKey,
  programId: PublicKey = METADATA_PROGRAM_ID,
) => {
  return PublicKey.findProgramAddress(
    [Buffer.from('metadata', 'utf8'), programId.toBuffer(), mint.toBuffer()],
    programId,
  )
}

export const findMasterEditionV2Pda = (
  mint: PublicKey,
  programId: PublicKey = METADATA_PROGRAM_ID,
) => {
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

export const findEditionPda = (
  mint: PublicKey,
  programId: PublicKey = METADATA_PROGRAM_ID,
  // eslint-disable-next-line sonarjs/no-identical-functions
) => {
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

export const findCollectionAuthorityRecordPda = (
  mint: PublicKey,
  collectionAuthority: PublicKey,
  programId: PublicKey = METADATA_PROGRAM_ID,
) => {
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

export const findUseAuthorityRecordPda = (
  mint: PublicKey,
  useAuthority: PublicKey,
  programId: PublicKey = METADATA_PROGRAM_ID,
) => {
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
