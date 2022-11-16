import { PassAnimationEnum } from '../pass/enum/pass-animation.enum'
import { PassImageEnum } from '../pass/enum/pass-image.enum'
import { PassMediaEnum } from '../pass/enum/pass-media.enum'

// Maps size to file suffix
export enum PassSize {
  NORMAL = '',
  SMALL = '-sm',
}

function getPath(cloudfrontUrl: string | null, path: string): string {
  return cloudfrontUrl ? `${cloudfrontUrl}/${path}` : path
}

export function getCollectionMediaUri(
  cloudfrontUrl: string | null,
  passId: string,
  contentType: PassMediaEnum | PassImageEnum | PassAnimationEnum,
  size: PassSize,
): string {
  return getPath(cloudfrontUrl, `nft/${passId}/media${size}.${contentType}`)
}

export function getCollectionMetadataUri(
  cloudfrontUrl: string | null,
  passId: string,
): string {
  return getPath(cloudfrontUrl, `nft/${passId}/metadata.json`)
}

export function getNftMediaUri(
  cloudfrontUrl: string | null,
  passId: string,
  passHolderId: string,
  contentType: PassMediaEnum | PassImageEnum | PassAnimationEnum,
  size: PassSize,
): string {
  return getPath(
    cloudfrontUrl,
    `nft/${passId}/${passHolderId}/media${size}.${contentType}`,
  )
}

export function getNftMetadataUri(
  cloudfrontUrl: string | null,
  passId: string,
  passHolderId: string,
): string {
  return getPath(cloudfrontUrl, `nft/${passId}/${passHolderId}/metadata.json`)
}
