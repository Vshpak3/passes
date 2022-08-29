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

export const composeMediaGridLayout = (length: number, index: number) => {
  switch (length) {
    case 1:
      return "col-span-12"
    case 2:
      return "md:col-span-6"
    case 4:
      return "md:col-span-6"
    case 3:
      return "md:col-span-6"
    case 5:
      return index === 0 || index === 1 ? "md:col-span-6" : "md:col-span-4"
    default:
      return "md:col-span-4"
  }
}
