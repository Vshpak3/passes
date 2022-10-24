import {
  ContentApi,
  ContentDto,
  ContentDtoContentTypeEnum,
  PassDtoAnimationTypeEnum,
  PassDtoImageTypeEnum
} from "@passes/api-client"
import path from "path"
import { toast } from "react-toastify"
import { ContentFile } from "src/hooks/useMedia"

import { isDev } from "./env"

const getUrlPath = (...args: string[]) => {
  return `${process.env.NEXT_PUBLIC_CDN_URL}/${path.join(...args)}`
}

export class ContentService {
  private readonly contentApi = new ContentApi()

  // Profile

  static profileImagePath(userId: string): string {
    return getUrlPath("profile", userId, "profile-image.jpeg")
  }

  static profileThumbnailPath(userId: string): string {
    // In dev there is no lambda to generate the thumbnail so use the profile image itself
    if (isDev) {
      return ContentService.profileImagePath(userId)
    }
    return getUrlPath("profile", userId, "profile-thumbnail.jpeg")
  }

  static profileBanner(userId: string): string {
    return getUrlPath("profile", userId, "banner.jpeg")
  }

  // Passes/NFTs

  static passHolderImagePath(
    passId: string,
    passHolderId: string,
    imageType: PassDtoImageTypeEnum
  ): string {
    return getUrlPath("nft", passId, passHolderId, `media.${imageType}`)
  }

  static passHolderAnimationPath(
    passId: string,
    passHolderId: string,
    animationType: PassDtoAnimationTypeEnum
  ): string {
    return getUrlPath("nft", passId, passHolderId, `media.${animationType}`)
  }

  static passImagePath(
    passId: string,
    imageType: PassDtoImageTypeEnum
  ): string {
    return getUrlPath("nft", passId, `media.${imageType}`)
  }

  static passAnimationPath(
    passId: string,
    animationType: PassDtoAnimationTypeEnum
  ): string {
    return getUrlPath("nft", passId, `media.${animationType}`)
  }

  // User Content

  static userContentMediaPath(content: ContentDto): string {
    if (content.signedUrl) {
      return content.signedUrl
    }

    let extension: string
    switch (content.contentType) {
      case ContentDtoContentTypeEnum.Image:
        extension = "jpeg"
        break
      case ContentDtoContentTypeEnum.Video:
        extension = "mp4"
        break
      case ContentDtoContentTypeEnum.Gif:
      case ContentDtoContentTypeEnum.Audio:
        throw new Error("Unsupported media format")
    }

    return getUrlPath(
      "media",
      content.userId,
      `${content.contentId}.${extension}`
    )
  }

  static userContentThumbnailPath(content: ContentDto): string {
    // In dev there is no lambda to generate the thumbnail so use the media itself
    if (isDev) {
      return ContentService.userContentMediaPath(content)
    }
    return getUrlPath(
      "media",
      content.userId,
      `${content.contentId}-thumbnail.jpeg`
    )
  }

  // Other

  static w9PublicPdfPath(): string {
    return getUrlPath("assets", "w9.pdf")
  }

  // Upload methods

  /**
   * Get content type from file type.
   * @returns ContentTypeEnum (image|video|audio)
   */
  private getFileContentType(file: File) {
    const match = file.type.match(/^(image|video|audio)\//)
    if (!match) {
      return null
    }
    return match[1] as ContentDtoContentTypeEnum
  }

  /**
   *
   * @param url content url. As follows `cdn_url/upload|media/user_id/content_id.extension`
   * @returns parsed content url
   */
  private parseContentUrl(url: string) {
    /*
      Group 1 (id):
      [^\/]+ match one of more non-slash character after last slash
      Group 2 (file extension):
      \w+ match one of more word characters after the dot
    */
    const match = url.match(/\/([^/]+)\.(\w+)$/) as RegExpMatchArray
    const { 1: id, 2: fileExtension } = match
    return {
      url,
      id,
      fileExtension
    }
  }

  private async uploadFile(url: string, file: File): Promise<string> {
    try {
      const response = await fetch(url, {
        method: "PUT",
        // omit cookies in dev
        credentials: !isDev ? "include" : undefined,
        body: file
      })

      if (!response.status.toString().startsWith("2")) {
        console.error(await response.text())
        throw new Error("There was an error uploading the file")
      }
    } catch (err: any) {
      toast.error("There was an error uploading the file")
      throw err
    }

    // remove signatures from uploaded file
    return url.split("?")[0]
  }

  async uploadProfileImage(file: File) {
    return this.uploadFile(
      (await this.contentApi.preSignProfileImage()).url,
      file
    )
  }

  async uploadProfileBanner(file: File) {
    return this.uploadFile(
      (await this.contentApi.preSignProfileBanner()).url,
      file
    )
  }

  async uploadPassMedia(
    file: File,
    passId: string,
    type: PassDtoImageTypeEnum | PassDtoAnimationTypeEnum
  ) {
    const { url } = await this.contentApi.preSignPass({
      presignPassRequestDto: { passId, type }
    })
    return this.uploadFile(url, file)
  }

  async uploadW9(file: File) {
    return this.uploadFile((await this.contentApi.preSignW9()).url, file)
  }

  /**
   *
   * @param files list of files to upload
   * @param contentType optional parameter to override default file type (useful for gifs since they are video/mp4 files)
   * @param requestConfig optional parameter
   * @returns Content array
   */
  async uploadContent(
    files: ContentFile[],
    contentType?: ContentDtoContentTypeEnum,
    requestConfig?: { inPost: boolean; inMessage: boolean }
  ): Promise<string[]> {
    if (!files.length) {
      return await Promise.resolve([])
    }
    return await Promise.all(
      files.map(async (file: ContentFile) => {
        if (!file.file) {
          return file.content?.contentId ?? ""
        }
        const _contentType = contentType ?? this.getFileContentType(file.file)
        if (!_contentType) {
          throw new Error("invalid file type")
        }
        const { url } = await this.contentApi.preSignContent({
          createContentRequestDto: {
            contentType: _contentType,
            inPost: requestConfig?.inPost || false,
            inMessage: requestConfig?.inMessage || false
          }
        })
        const result = await this.uploadFile(url, file.file)
        return this.parseContentUrl(result).id
      })
    )
  }
}
