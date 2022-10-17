import { FollowApi } from "@passes/api-client"
import { useEffect } from "react"
import { toast } from "react-toastify"
import useSWR from "swr"

const CACHE_KEY_BLOCKED = "/follow/blocked"

export const useBlockUnblockUser = (
  displayName?: string,
  blockedCreatorId?: string
) => {
  const api = new FollowApi()

  const {
    data: blockedUsersList = [],
    mutate: mutateBlockedUsersList,
    isValidating: isLoadingBlockedUsersList
  } = useSWR(
    displayName ? [CACHE_KEY_BLOCKED, displayName] : null,
    async () => {
      return (
        await api.getBlocked({
          searchFollowRequestDto: {
            displayName,
            order: "asc",
            orderType: "username"
          }
        })
      ).data
    }
  )

  const unblockUser = () => {
    return api.unblockFollower({
      followerId: blockedCreatorId || ""
    })
  }

  const blockUser = () => {
    return api.blockFollower({
      followerId: blockedCreatorId || ""
    })
  }

  useEffect(() => {
    mutateBlockedUsersList().catch((error) => toast(error))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayName])

  return {
    blockedUsersList,
    mutateBlockedUsersList,
    isLoadingBlockedUsersList,
    unblockUser,
    blockUser
  }
}
