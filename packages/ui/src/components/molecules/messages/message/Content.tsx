import { ContentDto, MessageDto } from "@passes/api-client"
import React, { useState } from "react"
import { PostUnlockButton } from "src/components/atoms/Button"
import { BuyMessageModal } from "src/components/organisms/payment/BuyMessageModal"
import { contentTypeCounter } from "src/helpers/contentTypeCounter"
import { formatCurrency } from "src/helpers/formatters"
interface Props {
  paid: boolean
  contents: any
  price: number | any
  message: MessageDto
  isOwnMessage: boolean
}

export const Content = ({
  contents,
  paid,
  price,
  message,
  isOwnMessage
}: Props) => {
  const [openBuyMessageModal, setOpenBuyMessageModal] = useState(false)
  const { images, video } = contentTypeCounter(contents)
  const isPaid =
    !paid && price > 0 && !isOwnMessage ? "opacity-50 blur-xl" : "opacity-100"
  const gridCols =
    contents.length === 1
      ? "grid-cols-1 overflow-hidden"
      : contents.length === 2
      ? "grid-cols-2 overflow-hidden"
      : contents.length === 3
      ? "grid-cols-3 overflow-auto"
      : contents.length > 3
      ? "grid-cols-2 overflow-auto"
      : null

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {!isOwnMessage && price > 0 && !paid && contents && (
        <div className="absolute z-10 flex w-max flex-col justify-center ">
          <PostUnlockButton
            onClick={() => setOpenBuyMessageModal(true)}
            value="test"
            name={`Unlock For ${formatCurrency(price ?? 100)}`}
            className="max-w-[200px] gap-1 py-2 text-[14px]"
          />
          <div className="flex items-center justify-center px-2 pt-4 text-[#ffffff]">
            <span>
              Unlock {video} videos, {images} photos
            </span>
          </div>
        </div>
      )}
      <div className={`grid ${gridCols} z-0 max-h-[300px] items-center  gap-2`}>
        {contents.map((content: ContentDto, index: any) => (
          <div key={index} className="col-span-1">
            <img
              src={`${process.env.NEXT_PUBLIC_CDN_URL}/media/${content.userId}/${content.contentId}.jpeg`}
              alt=""
              className={`w-full rounded-md object-contain ${isPaid}`}
            />
          </div>
        ))}
      </div>
      {openBuyMessageModal && (
        <BuyMessageModal
          message={message}
          isOpen={openBuyMessageModal}
          setOpen={setOpenBuyMessageModal}
        />
      )}
    </div>
  )
}
