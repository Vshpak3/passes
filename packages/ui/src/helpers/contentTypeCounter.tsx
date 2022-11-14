import { ContentBareDto, ContentDtoContentTypeEnum } from "@passes/api-client"

export const contentTypeCounter = (content?: ContentBareDto[]) => {
  let imagesLength = 0
  let videoLength = 0
  let audioLength = 0
  content &&
    content.forEach(({ contentType }) => {
      if (contentType === ContentDtoContentTypeEnum.Image) {
        ++imagesLength
      }
      if (contentType === ContentDtoContentTypeEnum.Video) {
        ++videoLength
      }
      if (contentType === ContentDtoContentTypeEnum.Audio) {
        ++audioLength
      }
    })
  return {
    images: imagesLength,
    video: videoLength,
    audio: audioLength
  }
}
