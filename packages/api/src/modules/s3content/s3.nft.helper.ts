import { ContentFormatEnum } from '../content/enums/content-format.enum'

function getPath(cloudfrontUrl: string | null, path: string): string {
  return cloudfrontUrl ? `${cloudfrontUrl}/${path}` : path
}

export function getCollectionImagePath(
  passId: string,
  contentType: ContentFormatEnum,
): string {
  return `nft/${passId}/image.${contentType}`
}

export function getCollectionMetadataPath(passId: string): string {
  return `nft/${passId}/metadata.json`
}

export function getNftImagePath(
  passId: string,
  passHolderId: string,
  contentType: ContentFormatEnum,
): string {
  return `nft/${passId}/${passHolderId}/image.${contentType}`
}

export function getNftMetadataPath(
  passId: string,
  passHolderId: string,
): string {
  return `nft/${passId}/${passHolderId}/metadata.json`
}

export function getCollectionImageUri(
  cloudfrontUrl: string | null,
  passId: string,
  contentType: ContentFormatEnum,
): string {
  return getPath(cloudfrontUrl, getCollectionImagePath(passId, contentType))
}

export function getCollectionMetadataUri(
  cloudfrontUrl: string | null,
  passId: string,
): string {
  return getPath(cloudfrontUrl, getCollectionMetadataPath(passId))
}

export function getNftImageUri(
  cloudfrontUrl: string | null,
  passId: string,
  passHolderId: string,
  contentType: ContentFormatEnum,
): string {
  return getPath(
    cloudfrontUrl,
    getNftImagePath(passId, passHolderId, contentType),
  )
}

export function getNftMetadataUri(
  cloudfrontUrl: string | null,
  passId: string,
  passHolderId: string,
): string {
  return getPath(cloudfrontUrl, getNftMetadataPath(passId, passHolderId))
}
