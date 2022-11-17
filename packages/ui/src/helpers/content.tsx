import {
  ContentApi,
  ContentBareDto,
  ContentDto,
  ContentDtoContentTypeEnum,
  PassDtoAnimationTypeEnum,
  PassDtoImageTypeEnum
} from "@passes/api-client"
import path from "path"
import { toast } from "react-toastify"

import { ContentFile } from "src/hooks/useMedia"
import { isDev } from "./env"
import { promiseAllBatched, retryWrapper } from "./upload"

const UPLOAD_BATCH_SIZE = 10
const UPLOAD_MAX_RETRIES = 3

const getUrlPath = (...args: string[]) => {
  return `${process.env.NEXT_PUBLIC_CDN_URL}/${path.join(...args)}`
}

enum ContentSizeEnum {
  SMALL = "sm",
  MEDIUM = "md",
  LARGE = "lg"
}

interface UploadUserContentProps {
  files: ContentFile[]
  contentType?: ContentDtoContentTypeEnum
  inPost?: boolean
  inMessage?: boolean
  showMessage?: boolean
}

export class ContentService {
  private readonly contentApi = new ContentApi()

  // Profile

  static profileImagePath(userId: string): string {
    return getUrlPath("profile", "media", userId, "profile-image.jpeg")
  }

  static profileThumbnailPath(userId: string): string {
    // In dev there is no lambda to generate the thumbnail so use the profile image itself
    if (isDev) {
      return ContentService.profileImagePath(userId)
    }
    return getUrlPath("profile", "media", userId, "profile-thumbnail.jpeg")
  }

  static profileBanner(userId: string): string {
    return getUrlPath("profile", "media", userId, "profile-banner.jpeg")
  }

  // Passes/NFTs

  static passHolderMediaPath(
    passId: string,
    passHolderId: string,
    imageType: PassDtoImageTypeEnum | PassDtoAnimationTypeEnum
  ): string {
    // Uses media-sm file
    return getUrlPath("nft", passId, passHolderId, `media-sm.${imageType}`)
  }

  static passMediaPath(
    passId: string,
    imageType: PassDtoImageTypeEnum | PassDtoAnimationTypeEnum
  ): string {
    // Uses media-sm file
    return getUrlPath("nft", passId, `media-sm.${imageType}`)
  }

  // Not currently supported
  // static passThumbnailPath(passId: string): string {
  //   return getUrlPath("nft", passId, `media-thumbnail.jpeg`)
  // }

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

    // Temporary for videos until we add sizing
    if (extension === "mp4") {
      return getUrlPath(
        "media",
        content.userId,
        `${content.contentId}.${extension}`
      )
    }
    // Use medium for everything now
    return getUrlPath(
      "media",
      content.userId,
      `${content.contentId}-${ContentSizeEnum.MEDIUM}.${extension}`
    )
  }

  static userContentThumbnailPath(content: ContentDto): string {
    // In dev there is no lambda to generate the thumbnail so use the media itself
    if (isDev) {
      return ContentService.userContentMediaPath(content)
    }
    // Currently, this should never be used
    if (content.signedThumbnailUrl) {
      return content.signedThumbnailUrl
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
    } catch (error: unknown) {
      toast.error("There was an error uploading the file")
      throw error
    }

    // remove signatures from uploaded file
    return url.split("?")[0]
  }

  async uploadProfileImage(file: File) {
    return this.uploadFile(
      (await this.contentApi.preSignUploadProfileImage()).url,
      file
    )
  }

  async uploadProfileBanner(file: File) {
    return this.uploadFile(
      (await this.contentApi.preSignUploadProfileBanner()).url,
      file
    )
  }

  async uploadPassMedia(
    file: File,
    passId: string,
    type: PassDtoImageTypeEnum | PassDtoAnimationTypeEnum
  ) {
    const { url } = await this.contentApi.preSignUploadPass({
      presignPassRequestDto: { passId, type }
    })
    return this.uploadFile(url, file)
  }

  async uploadW9(file: File) {
    return this.uploadFile((await this.contentApi.preSignUploadW9()).url, file)
  }

  /**
   * Uploads user content
   *
   * @param files list of files to upload
   * @param contentType optional parameter to override default file type (useful for gifs since they are video/mp4 files)
   * @returns Content array
   */
  async uploadUserContentBare({
    files,
    contentType: _contentType,
    inPost = false,
    inMessage = false,
    showMessage = true
  }: UploadUserContentProps): Promise<ContentBareDto[]> {
    if (!files.length) {
      return await Promise.resolve([])
    }
    if (showMessage) {
      toast.info("Please wait a moment as your content is uploaded")
    }
    return await promiseAllBatched(
      files,
      async (file: ContentFile) => {
        const fileFile = file.file
        if (!fileFile) {
          return file.content
        }
        const contentType = _contentType ?? this.getFileContentType(fileFile)
        if (!contentType) {
          throw new Error("Invalid file type")
        }
        const { url } = await this.contentApi.preSignUploadContent({
          createContentRequestDto: {
            contentType,
            inPost,
            inMessage,
            contentLength: fileFile.size
          }
        })
        const result = await retryWrapper(
          () => this.uploadFile(url, fileFile),
          UPLOAD_MAX_RETRIES
        )
        const contentId = this.parseContentUrl(result).id
        await this.contentApi.markUploaded({
          markUploadedRequestDto: { contentId }
        })
        return { contentId, type: contentType }
      },
      UPLOAD_BATCH_SIZE
    ).then((r) => {
      toast.dismiss()
      return r
    })
  }

  /**
   * Uploads user content
   *
   * @param files list of files to upload
   * @param contentType optional parameter to override default file type (useful for gifs since they are video/mp4 files)
   * @returns Content array
   */
  async uploadUserContent({
    ...res
  }: UploadUserContentProps): Promise<string[]> {
    return (await this.uploadUserContentBare(res)).map(
      (contentBare) => contentBare.contentId
    )
  }
}
