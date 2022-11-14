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
  const { data: passHolders } = useSWR<PassHolderDto[]>(
    [CACHE_KEY_PASS_HOLDERS, userId, passId],
    async () => {
      return (
        await api.getPassHolders({
          getPassHoldersRequestDto: {
            holderId: userId,
            passId,
            order: GetPassHoldersRequestDtoOrderEnum.Desc,
            orderType: GetPassHoldersRequestDtoOrderTypeEnum.CreatedAt,
            activeOnly: true
          }
        })
      ).data
    },
    { revalidateOnMount: true }
  )

  return {
    passHolders
  }
}
