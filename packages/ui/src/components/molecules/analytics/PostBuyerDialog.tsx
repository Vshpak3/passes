import {
  GetPostBuyersRequestDto,
  GetPostBuyersResponseDto,
  PostApi,
  PostBuyerDto
} from "@passes/api-client"
import React, { FC, useCallback, useState } from "react"

import { Button } from "src/components/atoms/button/Button"
import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { ListMember } from "src/components/organisms/creator-tools/lists/ListMember"
import { Dialog } from "src/components/organisms/Dialog"

interface PostBuyerDialogProps {
  onClose: () => void
  postId: string
}
export const PostBuyerDialog: FC<PostBuyerDialogProps> = ({
  onClose,
  postId
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
      title="Post Buyers"
    >
      <div className="h-[80%]" id="scrollableDiv" ref={ref}>
        <InfiniteScrollPagination<PostBuyerDto, GetPostBuyersResponseDto>
          KeyedComponent={({ arg }: ComponentArg<PostBuyerDto>) => {
            return (
              <ListMember
                fanInfo={{
                  listMemberId: arg.postUserAccessId,
                  ...arg,
                  createdAt: arg.paidAt ?? new Date()
                }}
                removable={false}
              />
            )
          }}
          fetch={async (req: GetPostBuyersRequestDto) => {
            const api = new PostApi()
            return await api.getPostBuyers({
              getPostBuyersRequestDto: req
            })
          }}
          fetchProps={{ postId }}
          keySelector="postUserAccessId"
          keyValue={`/post-buyer/${postId}`}
          node={node}
          scrollableTarget="scrollableDiv"
        />
      </div>
    </Dialog>
  )
}
