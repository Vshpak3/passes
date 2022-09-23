import { ContentFormatEnum } from '../content/enums/content-format.enum'

function getPath(cloudfrontUrl: string | null, path: string): string {
  return cloudfrontUrl ? `${cloudfrontUrl}/${path}` : path
}

export function getCollectionImageUri(
  cloudfrontUrl: string | null,
  passId: string,
  contentType: ContentFormatEnum,
): string {
  return getPath(cloudfrontUrl, `nft/${passId}/image.${contentType}`)
}

export function getCollectionMetadataUri(
  cloudfrontUrl: string | null,
  passId: string,
): string {
  return getPath(cloudfrontUrl, `nft/${passId}/metadata.json`)
}

export function getNftImageUri(
  cloudfrontUrl: string | null,
  passId: string,
  passHolderId: string,
  contentType: ContentFormatEnum,
): string {
  return getPath(
    cloudfrontUrl,
    `nft/${passId}/${passHolderId}/image.${contentType}`,
  )
}

export function getNftMetadataUri(
  cloudfrontUrl: string | null,
  passId: string,
  passHolderId: string,
): string {
  return getPath(cloudfrontUrl, `nft/${passId}/${passHolderId}/metadata.json`)
}
