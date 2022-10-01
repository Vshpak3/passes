import { PassDto } from "@passes/api-client"

export const getWhiteListedPasses = (
  external: PassDto[],
  postPasses?: string[]
) => {
  const result =
    postPasses &&
    postPasses.map((post) => {
      const whiteList = external.find(({ passId }) => passId === post)
      if (whiteList) {
        return whiteList
      }
    })
  return Array.from(new Set(result))
}
