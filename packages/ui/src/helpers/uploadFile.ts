import { ContentApi } from "@passes/api-client"

import { wrapApi } from "./wrapApi"

const api = wrapApi(ContentApi)

export const uploadFile = async (
  file: File,
  folder: "uploads" | "profile" | "nft" = "uploads"
) => {
  let { url } = await api.contentPreSignUrl({
    path: `${folder}/${file.name}`
  })

  await fetch(url, {
    method: "PUT",
    credentials: process.env.NODE_ENV !== "development" ? "include" : undefined,
    body: file
  })

  // replace usercontent upstream folder name with downstream one
  if (folder === "uploads") url = url.replace(`/${folder}/`, "/media/")
  url = url.split("?")[0]

  return url
}
