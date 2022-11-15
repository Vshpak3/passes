import {
  GetMessageBuyersRequestDto,
  GetMessageBuyersResponseDto,
  MessageBuyerDto,
  MessagesApi
} from "@passes/api-client"
import React, { FC, useCallback, useState } from "react"

import { Button } from "src/components/atoms/button/Button"
import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { ListMember } from "src/components/organisms/creator-tools/lists/ListMember"
import { Dialog } from "src/components/organisms/Dialog"

interface MessageBuyerDialogProps {
  onClose: () => void
  paidMessageId: string
}
export const MessageBuyerDialog: FC<MessageBuyerDialogProps> = ({
  onClose,
  paidMessageId
}) => {
  const [node, setNode] = useState<HTMLDivElement>()
  const ref = useCallback((node: HTMLDivElement) => {
    setNode(node)
  }, [])

  return (
    <Dialog
      className="flex h-[90vh] min-w-[400px] flex-col items-center justify-center border border-[#ffffff]/10 bg-[#0c0609] px-[29px] py-5 transition-all md:rounded-[15px]"
      footer={
        <div className="relative h-full pt-5">
          <div className="flex h-full flex-col items-start justify-start gap-3">
            <div className="flex w-full items-end justify-between gap-3">
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        </div>
      }
      innerScroll
      onClose={onClose}
      open
      title="Message Buyers"
    >
      <div className="h-[80%]" id="scrollableDiv" ref={ref}>
        <InfiniteScrollPagination<MessageBuyerDto, GetMessageBuyersResponseDto>
          KeyedComponent={({ arg }: ComponentArg<MessageBuyerDto>) => {
            return (
              <ListMember
                fanInfo={{
                  listMemberId: arg.messageId,
                  ...arg,
                  createdAt: arg.paidAt ?? new Date()
                }}
                removable={false}
              />
            )
          }}
          fetch={async (req: GetMessageBuyersRequestDto) => {
            const api = new MessagesApi()
            return await api.getMessageBuyers({
              getMessageBuyersRequestDto: req
            })
          }}
          fetchProps={{ paidMessageId }}
          keySelector="messageId"
          keyValue={`/message-buyer/${paidMessageId}`}
          node={node}
          scrollableTarget="scrollableDiv"
        />
      </div>
    </Dialog>
  )
}
