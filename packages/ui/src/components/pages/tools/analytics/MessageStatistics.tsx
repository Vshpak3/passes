import {
  GetPaidMessagesRequestDto,
  GetPaidMessagesResponseDto,
  MessagesApi,
  PaidMessageDto
} from "@passes/api-client"
import React from "react"

import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { PaidMessageStatistic } from "src/components/organisms/analytics/PaidMessageStatistic"

const MessageStatistics = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between border-b border-passes-dark-200">
        <div className="mb-4 flex flex-1 justify-center">
          <span className="text-[12px] font-[500]">Date & Time</span>
        </div>
        <div className="mb-4 flex flex-1 justify-center">
          <span className="text-[12px] font-[500]">Text</span>
        </div>
        <div className="mb-4 flex flex-1 items-center justify-center gap-2">
          <span className="text-[12px] font-[500]">Attachments</span>
        </div>
        <div className="flex flex-1 justify-center">
          <span className="mb-4 text-[12px] font-[500]">Price</span>
        </div>
        <div className="flex flex-1 justify-center">
          <span className="mb-4 text-[12px] font-[500]">Sent To</span>
        </div>
        <div className="flex flex-1 justify-center">
          <span className="mb-4 text-[12px] font-[500]">Purchases</span>
        </div>
        <div className="flex flex-1 justify-center">
          <span className="mb-4 text-[12px] font-[500]">Purchase Earnings</span>
        </div>
        <div className="flex flex-1 justify-center">
          <span className="mb-4 text-[12px] font-[500]">Create List</span>
        </div>
        <div className="mb-4 flex flex-1 justify-center">
          <span className="text-[12px] font-[500]">Unsend</span>
        </div>
      </div>
      <InfiniteScrollPagination<PaidMessageDto, GetPaidMessagesResponseDto>
        keyValue={`paid-messages`}
        fetch={async (req: GetPaidMessagesRequestDto) => {
          const api = new MessagesApi()
          return await api.getPaidMessages({
            getPaidMessagesRequestDto: req
          })
        }}
        fetchProps={{}}
        emptyElement={<span>No messages to show</span>}
        KeyedComponent={({ arg }: ComponentArg<PaidMessageDto>) => {
          return <PaidMessageStatistic paidMessage={arg} />
        }}
      />
    </div>
  )
}

export default MessageStatistics // eslint-disable-line import/no-default-export
