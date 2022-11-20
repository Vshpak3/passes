import path from 'path'

import { isEnv } from '../../../util/env'
import { ContentSizeEnum } from '../enums/content-size.enum'
import { ContentTypeEnum } from '../enums/content-type.enum'

export type PROFILE_CONTENT_TYPES = 'image' | 'banner'

// The video type is mp4 or m3u8 depending on upload vs download
enum ContentFormatEnum {
  IMAGE = 'jpeg',
  VIDEO = 'mp4',
  VIDEO_UPLOAD = 'mp4',
  GIF = 'mp4',
  AUDIO = 'mp3',
}

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
  let fileName = ''
  switch (contentType) {
    case ContentTypeEnum.IMAGE:
      fileName = `${contentId}-${contentSize}`
      break
    case ContentTypeEnum.VIDEO:
      fileName = `${contentId}-standalone`
      break
    case ContentTypeEnum.GIF:
    case ContentTypeEnum.AUDIO:
      throw new Error('Not yet implemented')
  }
  return path.join(
    'media',
    userId,
    `${fileName}.${getContentTypeFormat(contentType)}`,
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
  const extension =
    contentType === ContentTypeEnum.VIDEO
      ? ContentFormatEnum.VIDEO_UPLOAD
      : getContentTypeFormat(contentType)
  return path.join(
    'upload',
    !isEnv('dev') ? contentType : '',
    userId,
    `${contentId}.${extension}`,
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
