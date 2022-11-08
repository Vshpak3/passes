import { MessagesApi } from "@passes/api-client"
import {
  ChannelMemberDto,
  GetChannelsRequestDto,
  GetChannelsRequestDtoOrderTypeEnum as OrderType,
  GetChannelsResponseDto
} from "@passes/api-client/models"
import classNames from "classnames"
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
  selectedChannel?: ChannelMemberDto
  onChannelClicked: (channel: ChannelMemberDto) => void
  openChannelView: boolean
}

export const ChannelList: FC<ChannelListProps> = ({
  selectedChannel,
  onChannelClicked,
  openChannelView
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
    <div
      className={classNames(
        "col-span-9 h-full overflow-y-hidden border-r border-[#fff]/10 pt-20 lg:col-span-3 lg:pt-0",
        openChannelView ? "hidden" : "block",
        "lg:block"
      )}
    >
      <div className="border-b border-[#fff]/10 p-3">
        <ChannelSearchInput
          handleSearch={handleChangeSearch}
          placeholder="Search ..."
        />
      </div>
      <div className={classNames("h-[calc(100%-120px)] p-3")}>
        <div className="flex justify-between">
          <div className="ml-auto mr-0">
            {!!user?.isCreator && (
              <SortDropdown
                onSelect={onSortSelect}
                options={sortOptions}
                selection={{ orderType: channelOrderType }}
              />
            )}
          </div>
        </div>
        <div className={classNames("overflow-y-auto")} id="channelDiv">
          <InfiniteScrollPagination<ChannelMemberDto, GetChannelsResponseDto>
            KeyedComponent={({
              arg: channel
            }: ComponentArg<ChannelMemberDto>) => {
              return (
                <ChannelListItem
                  channel={channel}
                  isSelected={selectedChannel?.channelId === channel.channelId}
                  onClick={() => onChannelClicked(channel)}
                />
              )
            }}
            className="pt-2"
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
            keyValue="/channels"
            options={{
              revalidateOnMount: true,
              revalidateAll: true,
              revalidateFirstPage: true,
              revalidateOnFocus: true,
              revalidateOnReconnect: true,
              refreshInterval: 1000,
              persistSize: true
            }}
            scrollableTarget="channelDiv"
            style={{ overflowX: "hidden" }}
          />
        </div>
      </div>
    </div>
  )
}
