import { MessagesApi } from "@passes/api-client"
import {
  ChannelMemberDto,
  GetChannelsRequestDto,
  GetChannelsRequestDtoOrderTypeEnum as OrderType,
  GetChannelsResponseDto,
  ListMemberDto
} from "@passes/api-client/models"
import { debounce } from "lodash"
import React, { FC, useCallback, useState } from "react"
import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import {
  SortDropdown,
  SortOption
} from "src/components/organisms/creator-tools/lists/SortDropdown"
import { useUser } from "src/hooks/useUser"

import { ChannelListItem } from "./ChannelListItem"
import { ChannelSearchInput } from "./ChannelSearchInput"

interface ChannelListProps {
  onUserSelect: (user: ListMemberDto) => void
  selectedChannel?: ChannelMemberDto
  onChannelClicked: (channel: ChannelMemberDto) => void
}

export const ChannelList: FC<ChannelListProps> = ({
  selectedChannel,
  onChannelClicked
}) => {
  const [channelOrderType, setChannelOrderType] = useState<OrderType>("recent")
  const { user } = useUser()

  const sortOptions: SortOption<OrderType>[] = [
    { orderType: OrderType.Recent },
    { orderType: OrderType.Tip }
  ]

  const DEBOUNCE_TIMEOUT = 500
  const [search, setSearch] = useState<string>("")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toLowerCase()
      setSearch(value)
    }, DEBOUNCE_TIMEOUT),
    []
  )

  const onSortSelect = useCallback((option: SortOption<OrderType>) => {
    setChannelOrderType(option.orderType)
  }, [])

  return (
    <div className="min-w-[35%] overflow-y-auto border-r border-[#fff]/10 p-[30px] ">
      <div className="border-b border-[#fff]/10 pb-6">
        <div className="flex justify-between pb-6">
          <span className="text-base font-medium">Find people</span>
          {!!user?.isCreator && (
            <SortDropdown
              selection={{ orderType: channelOrderType }}
              options={sortOptions}
              onSelect={onSortSelect}
            />
          )}
        </div>
        <ChannelSearchInput handleSearch={handleChangeSearch} />
      </div>

      <div className="pt-6">
        <InfiniteScrollPagination<ChannelMemberDto, GetChannelsResponseDto>
          keyValue="/channels"
          fetch={async (req: GetChannelsRequestDto) => {
            const api = new MessagesApi()
            return await api.getChannels({ getChannelsRequestDto: req })
          }}
          fetchProps={{
            unreadOnly: false,
            order: "desc",
            orderType: channelOrderType,
            search
          }}
          options={{
            revalidateOnMount: true,
            revalidateAll: true,
            revalidateFirstPage: true,
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            refreshInterval: 1000,
            persistSize: true
          }}
          KeyedComponent={({
            arg: channel
          }: ComponentArg<ChannelMemberDto>) => {
            return (
              <ChannelListItem
                onClick={() => onChannelClicked(channel)}
                channel={channel}
                isSelected={selectedChannel?.channelId === channel.channelId}
              />
            )
          }}
        />
      </div>
    </div>
  )
}
