import { MessagesApi } from "@passes/api-client"
import {
  ChannelMemberDto,
  GetChannelsRequestDto,
  GetChannelsRequestDtoOrderTypeEnum,
  GetChannelsResponseDto,
  ListMemberDto
} from "@passes/api-client/models"
import { debounce } from "lodash"
import React, { FC, useCallback, useState } from "react"
import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { OrderDropDown } from "src/components/molecules/OrderDropDown"
import { useUser } from "src/hooks/useUser"

import { ChannelListItem } from "./ChannelListItem"
import { ChannelSearchInput } from "./ChannelSearchInput"

interface ChannelListProps {
  channelOrderType: GetChannelsRequestDtoOrderTypeEnum
  setChannelOrderType: (order: GetChannelsRequestDtoOrderTypeEnum) => void
  onUserSelect: (user: ListMemberDto) => void
  selectedChannel?: ChannelMemberDto
  onChannelClicked: (channel: ChannelMemberDto) => void
}

export const ChannelList: FC<ChannelListProps> = ({
  channelOrderType,
  setChannelOrderType,
  selectedChannel,
  onChannelClicked
}) => {
  const channelOrders = [
    { id: GetChannelsRequestDtoOrderTypeEnum.Recent, name: "Most recent" },
    { id: GetChannelsRequestDtoOrderTypeEnum.Tip, name: "Highest Tip amount" }
  ]
  const { user } = useUser()

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
  return (
    <div className="min-w-[35%] overflow-y-auto border-r border-[#fff]/10 p-[30px] ">
      <div className="border-b border-[#fff]/10 pb-6">
        <div className="flex justify-between pb-6">
          <span className="text-base font-medium">Find people</span>
          {!!user?.isCreator && (
            <OrderDropDown
              orders={channelOrders}
              activeOrder={channelOrderType}
              setActiveOrder={setChannelOrderType as (order: string) => void}
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
