import { ContentApi, ContentDtoContentTypeEnum } from "@passes/api-client"

import { isDev } from "./env"

class Content {
  url!: string

  id?: string

  constructor(init?: Partial<Content>) {
    Object.assign(this, init)
  }
}

class ContentService {
  private readonly contentApi = new ContentApi()

  static profileImage(userId: string): string {
    return `${process.env.NEXT_PUBLIC_CDN_URL}/profile/${userId}/profile-image.jpeg`
  }

  static profileThumbnail(userId: string): string {
    return `${process.env.NEXT_PUBLIC_CDN_URL}/profile/${userId}/profile-thumbnail.jpeg`
  }

  static profileBanner(userId: string): string {
    return `${process.env.NEXT_PUBLIC_CDN_URL}/profile/${userId}/banner.jpeg`
  }

  static passImage(userId: string, passId: string): string {
    return `${process.env.NEXT_PUBLIC_CDN_URL}/pass/${userId}/${passId}.jpeg`
  }

  static w9Pdf(userId: string): string {
    return `${process.env.NEXT_PUBLIC_CDN_URL}/w9/${userId}/upload.pdf`
  }

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

  private async preSignUrl(
    type: "profile" | "banner" | "pass" | "content" | "w9",
    params?: any
  ) {
    switch (type) {
      case "profile": {
        const { url } = await this.contentApi.preSignProfileImage()
        return url
      }
      case "banner": {
        const { url } = await this.contentApi.preSignProfileBanner()
        return url
      }
      case "pass": {
        const { url } = await this.contentApi.preSignPass(params)
        return url
      }
      case "content": {
        const { url } = await this.contentApi.preSignContent(params)
        return url
      }
      case "w9": {
        const { url } = await this.contentApi.preSignW9()
        return url
      }
    }
  }

  private async uploadFile(url: string, file: File): Promise<string> {
    await fetch(url, {
      method: "PUT",
      // omit cookies in dev
      credentials: !isDev ? "include" : undefined,
      body: file
    })

    // remove signatures from uploaded file
    return url.split("?")[0]
  }

  async uploadProfileImage(file: File) {
    const url = await this.preSignUrl("profile")
    return this.uploadFile(url, file)
  }

  async uploadProfileBanner(file: File) {
    const url = await this.preSignUrl("banner")
    return this.uploadFile(url, file)
  }

  async uploadPassImage(file: File, passId: string) {
    const url = await this.preSignUrl("pass", { passId })
    return this.uploadFile(url, file)
  }

  async uploadW9(file: File) {
    const url = await this.preSignUrl("w9")
    return this.uploadFile(url, file)
  }

  /**
   *
   * @param files list of files to upload
   * @param contentType optional parameter to override default file type (useful for gifs since they are video/mp4 files)
   * @returns Content array
   */
  async uploadContent(
    files: File[],
    contentType?: ContentDtoContentTypeEnum
  ): Promise<Content[]> {
    if (!files.length) {
      return Promise.resolve([])
    }
    return Promise.all(
      files.map(async (file: File) => {
        const _contentType = contentType ?? this.getFileContentType(file)
        if (!_contentType) {
          throw new Error("invalid file type")
        }
        const url = await this.preSignUrl("content", {
          contentType: _contentType
        })
        const result = await this.uploadFile(url, file)
        const content = this.parseContentUrl(result)
        return new Content(content)
      })
    )
  }
}

export default ContentService
