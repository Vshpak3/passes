import { MessagesApi } from "@passes/api-client"
import {
  ChannelMemberDto,
  GetChannelsRequestDto,
  GetChannelsRequestDtoOrderEnum,
  GetChannelsRequestDtoOrderTypeEnum as OrderType,
  GetChannelsResponseDto
} from "@passes/api-client/models"
import classNames from "classnames"
import { debounce } from "lodash"
import React, { FC, useCallback, useMemo, useState } from "react"

import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import {
  orderTypeDisplayNames,
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

  const [node, setNode] = useState<HTMLDivElement>()
  const ref = useCallback((node: HTMLDivElement) => {
    setNode(node)
  }, [])

  const fetchProps = useMemo(() => {
    return {
      unreadOnly: false,
      order: GetChannelsRequestDtoOrderEnum.Desc,
      orderType: channelOrderType,
      search
    }
  }, [channelOrderType, search])

  return (
    <div
      className={classNames(
        "col-span-9 h-full overflow-y-hidden border-r border-passes-gray pt-20 lg:col-span-3 lg:pt-0",
        openChannelView ? "hidden" : "block",
        "lg:block"
      )}
    >
      <div className="h-full">
        <div
          className="max-h-full overflow-y-auto scrollbar-hide"
          id="channelsDiv"
          ref={ref}
        >
          <div className="border-b border-passes-gray p-3 px-6">
            <ChannelSearchInput
              handleSearch={handleChangeSearch}
              placeholder="Search ..."
            />
          </div>
          <div className="flex justify-between py-3 pr-3">
            <div className="ml-auto mr-0">
              {!!user?.isCreator && (
                <div className="flex items-start gap-[5px]">
                  <SortDropdown
                    onSelect={onSortSelect}
                    options={sortOptions}
                    selection={{ orderType: channelOrderType }}
                  />
                  {orderTypeDisplayNames[channelOrderType]}
                </div>
              )}
            </div>
          </div>

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
            fetch={async (req: GetChannelsRequestDto) => {
              const api = new MessagesApi()
              return await api.getChannels({ getChannelsRequestDto: req })
            }}
            fetchProps={fetchProps}
            keySelector="channelMemberId"
            keyValue="/pages/channels"
            node={node}
            options={{
              revalidateOnMount: false,
              revalidateFirstPage: true,
              revalidateOnFocus: true,
              revalidateOnReconnect: true,
              refreshInterval: 1000
            }}
            scrollableTarget="channelsDiv"
            style={{ overflowX: "hidden" }}
          />
        </div>
      </div>
    </div>
  )
}
