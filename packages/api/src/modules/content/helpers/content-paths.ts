import path from 'path'

import { ContentFormatEnum } from '../enums/content-format.enum'
import { ContentTypeEnum } from '../enums/content-type.enum'

const contentTypeFormatMap = {
  [ContentTypeEnum.IMAGE]: ContentFormatEnum.IMAGE,
  [ContentTypeEnum.VIDEO]: ContentFormatEnum.VIDEO,
  [ContentTypeEnum.GIF]: ContentFormatEnum.GIF,
  [ContentTypeEnum.AUDIO]: ContentFormatEnum.AUDIO,
}

function getContentTypeFormat(contentType: ContentTypeEnum) {
  return contentTypeFormatMap[contentType]
}

// Media/User Content

export function mediaContentPath(
  userId: string,
  contentId: string,
  contentType: ContentTypeEnum,
) {
  return path.join(
    'media',
    userId,
    `${contentId}.${getContentTypeFormat(contentType)}`,
  )
}

export function mediaContentThumbnailPath(userId: string, contentId: string) {
  return path.join(
    'media',
    userId,
    `${contentId}-thumbnail.${ContentFormatEnum.IMAGE}`,
  )
}

export function mediaContentUploadPath(
  userId: string,
  contentId: string,
  contentType: ContentTypeEnum,
) {
  return path.join(
    'upload',
    userId,
    `${contentId}.${getContentTypeFormat(contentType)}`,
  )
}

// Profile

export function profileImagePath(
  userId: string,
  type: 'image' | 'banner' | 'thumbnail',
) {
  return path.join(
    'profile',
    'media',
    userId,
    `profile-${type}.${ContentFormatEnum.IMAGE}`,
  )
}

export function profileImageUploadPath(
  userId: string,
  type: 'image' | 'banner',
) {
  return path.join(
    'profile',
    'upload',
    userId,
    `profile-${type}.${ContentFormatEnum.IMAGE}`,
  )
}

// Other

export function w9UploadPath(userId: string) {
  return path.join('w9', userId, 'upload.pdf')
}
