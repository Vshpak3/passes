import path from 'path'

import { isEnv } from '../../../util/env'
import { ContentFormatEnum } from '../enums/content-format.enum'
import { ContentSizeEnum } from '../enums/content-size.enum'
import { ContentTypeEnum } from '../enums/content-type.enum'

export type PROFILE_CONTENT_TYPES = 'image' | 'banner'

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
  contentSize: ContentSizeEnum,
) {
  return path.join(
    'media',
    userId,
    `${contentId}-${contentSize}.${getContentTypeFormat(contentType)}`,
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
    !isEnv('dev') ? contentType : '',
    userId,
    `${contentId}.${getContentTypeFormat(contentType)}`,
  )
}

// Profile

export function profileImagePath(
  userId: string,
  type: PROFILE_CONTENT_TYPES | 'thumbnail',
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
  type: PROFILE_CONTENT_TYPES,
) {
  return path.join(
    'profile',
    'upload',
    !isEnv('dev') ? type : '',
    userId,
    `profile-${type}.${ContentFormatEnum.IMAGE}`,
  )
}

// Other

export function w9UploadPath(userId: string) {
  return path.join('w9', userId, 'upload.pdf')
}
