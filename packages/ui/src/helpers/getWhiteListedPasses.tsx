import { PassDto } from "@passes/api-client"

export const getWhiteListedPasses = (
  external: PassDto[],
  passIds?: string[]
) => {
  const passSet = new Set(passIds ?? [])
  return external.filter((external) => {
    return passSet.has(external.passId)
  })
}
