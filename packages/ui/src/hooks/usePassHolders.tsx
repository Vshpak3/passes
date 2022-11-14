import {
  GetPassHoldersRequestDtoOrderEnum,
  GetPassHoldersRequestDtoOrderTypeEnum,
  PassApi,
  PassHolderDto
} from "@passes/api-client"
import useSWR from "swr"

const api = new PassApi()
const CACHE_KEY_PASS_HOLDERS = "/pass-holders"

export const usePassHolders = (userId?: string, passId?: string) => {
  console.log("asdf")
  const { data: passHolders } = useSWR<PassHolderDto[]>(
    [CACHE_KEY_PASS_HOLDERS, userId, passId],
    async () => {
      console.log("run")
      console.log("asfads")
      const res = await api.getPassHolders({
        getPassHoldersRequestDto: {
          // holderId: userId,
          passId,
          order: GetPassHoldersRequestDtoOrderEnum.Desc,
          orderType: GetPassHoldersRequestDtoOrderTypeEnum.CreatedAt,
          activeOnly: true
        }
      })
      console.log("done")
      console.log(res)
      return res.data
    },
    { revalidateOnMount: true }
  )

  return {
    passHolders
  }
}
