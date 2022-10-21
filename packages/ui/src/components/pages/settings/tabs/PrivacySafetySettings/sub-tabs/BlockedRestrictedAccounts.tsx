import {
  FollowApi,
  GetBlockedResponseDto,
  ListMemberDto,
  SearchFollowingResponseDtoOrderTypeEnum,
  SearchFollowRequestDto,
  SearchFollowRequestDtoOrderEnum
} from "@passes/api-client"
import { memo } from "react"
import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { BlockedUser } from "src/components/molecules/privacy/BlockedUser"
import { Tab } from "src/components/pages/settings/Tab"

const BlockedRestrictedAccounts = () => {
  return (
    <Tab
      withBack
      title="Blocked & Restricted Accounts"
      description="When you block someone, that person won’t be able to follow or message you, and you won’t see notifications from them."
    >
      <div className="mt-5 space-y-[26px] px-2.5">
        <InfiniteScrollPagination<ListMemberDto, GetBlockedResponseDto>
          keyValue={`blocked`}
          fetch={async (req: SearchFollowRequestDto) => {
            const api = new FollowApi()
            return await api.getBlocked({
              searchFollowRequestDto: req
            })
          }}
          fetchProps={{
            orderType: SearchFollowingResponseDtoOrderTypeEnum.CreatedAt,
            order: SearchFollowRequestDtoOrderEnum.Desc
          }}
          emptyElement={<span>No blocked users to show</span>}
          KeyedComponent={({ arg }: ComponentArg<ListMemberDto>) => {
            return <BlockedUser blockedUser={arg} />
          }}
          classes="mt-[25px] grid grid-cols-2 gap-[25px] pb-20 sidebar-collapse:grid-cols-3"
        />
      </div>
    </Tab>
  )
}

export default memo(BlockedRestrictedAccounts) // eslint-disable-line import/no-default-export
