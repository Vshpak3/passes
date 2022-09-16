import { ContentFormatEnum } from '../enums/content-format.enum'
import { ContentTypeEnum } from '../enums/content-type.enum'

const contentTypeFormatMap = {
  [ContentTypeEnum.IMAGE]: ContentFormatEnum.IMAGE,
  [ContentTypeEnum.VIDEO]: ContentFormatEnum.VIDEO,
  [ContentTypeEnum.GIF]: ContentFormatEnum.GIF,
  [ContentTypeEnum.AUDIO]: ContentFormatEnum.AUDIO,
}

export function getContentTypeFormat(contentType: ContentTypeEnum) {
  return contentTypeFormatMap[contentType]
}
