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
import ms from "ms"
import React, { FC, useCallback, useMemo, useState } from "react"
import { useForm } from "react-hook-form"

import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { Checkbox } from "src/components/atoms/input/Checkbox"
import {
  orderTypeDisplayNames,
  SortDropdown,
  SortOption
} from "src/components/organisms/SortDropdown"
import { useUser } from "src/hooks/useUser"
import { ChannelListItem } from "./ChannelListItem"
import { ChannelSearchInput } from "./ChannelSearchInput"

const DEBOUNCE_TIMEOUT = 500

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
  const { register, watch } = useForm({ defaultValues: { unreadOnly: false } })
  const unreadOnly = watch("unreadOnly")
  const sortOptions: SortOption<OrderType>[] = [
    { orderType: OrderType.Recent },
    { orderType: OrderType.Tip },
    { orderType: OrderType.Spent }
  ]

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
      order: GetChannelsRequestDtoOrderEnum.Desc,
      orderType: channelOrderType,
      search,
      unreadOnly
    }
  }, [channelOrderType, search, unreadOnly])

  return (
    <div
      className={classNames(
        "col-span-9 mb-16 h-full min-h-full overflow-y-hidden border-r border-passes-gray pt-20 lg:col-span-3 lg:mb-0 lg:pt-0",
        openChannelView ? "hidden" : "block",
        "lg:block"
      )}
    >
      <div className="h-full pb-16 lg:pb-0">
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
            {!!user?.isCreator && (
              <>
                <div className="flex flex-row gap-2 px-4">
                  Unread
                  <Checkbox
                    name="unreadOnly"
                    register={register}
                    type="toggle"
                  />
                </div>
                <div className="flex items-start gap-[5px]">
                  <SortDropdown
                    onSelect={onSortSelect}
                    options={sortOptions}
                    selection={{ orderType: channelOrderType }}
                  />
                  {orderTypeDisplayNames[channelOrderType]}
                </div>
              </>
            )}
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
              refreshInterval: ms("1 second")
            }}
            scrollableTarget="channelsDiv"
            style={{ overflowX: "hidden" }}
          />
        </div>
      </div>
    </div>
  )
}
