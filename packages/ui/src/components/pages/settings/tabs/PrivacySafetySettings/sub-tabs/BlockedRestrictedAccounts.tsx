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
import { SubTabsEnum } from "src/config/settings"

const fetchProps = {
  orderType: SearchFollowingResponseDtoOrderTypeEnum.CreatedAt,
  order: SearchFollowRequestDtoOrderEnum.Desc
}
const BlockedRestrictedAccounts = () => {
  return (
    <Tab
      defaultSubTab={SubTabsEnum.PrivacySafetySettings}
      description="When you block someone, that person won’t be able to follow or message you, and you won’t see notifications from them."
      title="Blocked & Restricted Accounts"
    >
      <div className="mt-5 space-y-[26px] px-2.5">
        <InfiniteScrollPagination<ListMemberDto, GetBlockedResponseDto>
          KeyedComponent={({ arg }: ComponentArg<ListMemberDto>) => {
            return <BlockedUser blockedUser={arg} />
          }}
          className="mt-[25px] gap-[25px] pb-20"
          emptyElement={<span>No blocked users to show</span>}
          fetch={async (req: SearchFollowRequestDto) => {
            const api = new FollowApi()
            return await api.getBlocked({
              searchFollowRequestDto: req
            })
          }}
          fetchProps={fetchProps}
          keySelector="userId"
          keyValue="/pages/blocked"
        />
      </div>
    </Tab>
  )
}

export default memo(BlockedRestrictedAccounts) // eslint-disable-line import/no-default-export
