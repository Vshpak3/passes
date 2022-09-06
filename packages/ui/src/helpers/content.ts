import { ContentApi } from "@passes/api-client"

import { wrapApi } from "./wrapApi"

class Content {
  private readonly contentApi = wrapApi(ContentApi)

  static profileImage(userId: string, profileId: string): string {
    return `${process.env.NEXT_PUBLIC_CDN_URL}/profile/${userId}/profile-${profileId}.jpg`
  }

  static profileBanner(userId: string, profileId: string): string {
    return `${process.env.NEXT_PUBLIC_CDN_URL}/profile/${userId}/banner-${profileId}.jpg`
  }

  static passImage(userId: string, passId: string): string {
    return `${process.env.NEXT_PUBLIC_CDN_URL}/pass/${userId}/${passId}.jpg`
  }

  static nftJson(collectionId: string, nftId: string): string {
    return `${process.env.NEXT_PUBLIC_CDN_URL}/nft/${nftId}.json`
  }

  private async uploadFile(
    file: File,
    folder: "profile" | "pass" | "usercontent"
  ): Promise<string> {
    let { url } = await this.contentApi.preSignUrl({
      path: `${folder}/${file.name}`
    })

    await fetch(url, {
      method: "PUT",
      credentials:
        process.env.NEXT_PUBLIC_NODE_ENV !== "dev" ? "include" : undefined,
      body: file
    })

    // Replace usercontent upstream folder name with downstream one
    if (folder === "usercontent") {
      url = url.replace(`/${folder}/`, "/media/")
    }
    url = url.split("?")[0]

    // TODO:
    // let contentType = file.type
    // if (file.type.startsWith("image/")) contentType = "image/jpeg"
    // if (file.type.startsWith("video/")) contentType = "video/mp4"
    // const content = await this.contentApi.createContent({
    //   createContentDto: { url, contentType }
    // })

    return url
  }

  async uploadPublicContent(
    files: File[],
    folder: "profile" | "pass"
  ): Promise<string[]> {
    if (!files.length) {
      return Promise.resolve([])
    }
    return Promise.all(files.map(async (f: File) => this.uploadFile(f, folder)))
  }

  async uploadUserContent(files: File[]): Promise<string[]> {
    if (!files.length) {
      return Promise.resolve([])
    }
    return Promise.all(
      files.map(async (f: File) => this.uploadFile(f, "usercontent"))
    )
  }
}

export default Content
