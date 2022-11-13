import { PostDto } from "@passes/api-client"
import classNames from "classnames"
import { format } from "date-fns"
import Link from "next/link"
import { FC, useState } from "react"
import { toast } from "react-toastify"

import { Button, ButtonVariant } from "src/components/atoms/button/Button"
import { DeleteConfirmationModal } from "src/components/molecules/DeleteConfirmationModal"
import { DeletePostModal } from "src/components/organisms/profile/post/DeletePostModal"
import { formatCurrency, formatText } from "src/helpers/formatters"
import { useUpdatePost } from "src/hooks/profile/useUpdatePost"
import { PostStatisticCachedProps } from "./PostStatisticCached"

interface PostStatisticProps extends PostStatisticCachedProps {
  post: PostDto
  update: (update: Partial<PostDto>) => void
}

export const PostStatistic: FC<PostStatisticProps> = ({ post, update }) => {
  const [deletePostModelOpen, setDeletePostModelOpen] = useState(false)
  const [hidePostModelOpen, setHidePostModelOpen] = useState(false)
  const { hidePost } = useUpdatePost()

  const {
    postId,
    createdAt,
    userId,
    text,
    contents,
    price,
    totalTipAmount,
    earningsPurchases,
    expiresAt,
    deletedAt,
    hiddenAt,
    numPurchases
  } = post

  const onDelete = async () => {
    update({ deletedAt: new Date() })
  }

  const onHide = async () => {
    try {
      await hidePost(postId)
      update({ hiddenAt: new Date() })
      toast.success("Your post was permanently removed")
    } catch (error: unknown) {
      toast.error("Failed to remove: please contact support")
    }
  }

  return (
    <>
      <div
        className={classNames(
          hiddenAt && "hidden",
          "flex flex-row justify-between border-b border-passes-dark-200"
        )}
      >
        <div className="flex h-[72px] flex-1 items-center justify-center">
          <Link href={`/${userId}/${postId}`}>
            <span className="text-[12px] font-[500]">
              {format(createdAt, "LL/dd/yyyy")}
              <br />
              {format(createdAt, "hh:mm a")}
            </span>
          </Link>
        </div>
        <div className="flex h-[72px] w-[100px] flex-1 items-center justify-start overflow-hidden">
          <Link href={`/${userId}/${postId}`}>
            <span className="w-full overflow-hidden truncate whitespace-pre-wrap text-[14px] font-[700]">
              {formatText(text)}
            </span>
          </Link>
        </div>
        <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
          <Link href={`/${userId}/${postId}`}>
            <span className="text-[12px] font-[500]">
              {contents?.length ?? 0}
            </span>
          </Link>
        </div>
        <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
          <Link href={`/${userId}/${postId}`}>
            <span className="text-[12px] font-[500]">
              {formatCurrency(price ?? 0)}
            </span>
          </Link>
        </div>
        <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
          <span className="text-[12px] font-[500]">{numPurchases}</span>
        </div>
        <div className="flex h-[72px] flex-1 items-center justify-center">
          <span className="text-[12px] font-[500]">
            {formatCurrency(totalTipAmount ?? 0)}
          </span>
        </div>
        <div className="flex h-[72px] flex-1 items-center justify-center">
          <span className="text-[12px] font-[500]">
            {formatCurrency(earningsPurchases)}
          </span>
        </div>

        <div className="flex h-[72px] flex-1 items-center justify-start">
          <span className="w-full overflow-hidden truncate text-center text-[14px] font-[700] text-passes-pink-100">
            {!deletedAt && (!expiresAt || expiresAt > new Date()) ? (
              <Button onClick={() => setDeletePostModelOpen(true)}>
                Delete
              </Button>
            ) : (
              <Button
                className="px-[18px]"
                onClick={() => setHidePostModelOpen(true)}
                variant={ButtonVariant.PINK_OUTLINE}
              >
                Remove
              </Button>
            )}
          </span>
        </div>
      </div>
      {deletePostModelOpen && (
        <DeletePostModal
          onDelete={onDelete}
          post={post}
          setOpen={setDeletePostModelOpen}
        />
      )}
      {hidePostModelOpen && (
        <DeleteConfirmationModal
          isOpen
          onClose={() => setHidePostModelOpen(false)}
          onDelete={onHide}
          text="Remove"
        />
      )}
    </>
  )
}
