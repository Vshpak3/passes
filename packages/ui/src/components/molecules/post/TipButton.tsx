import { PostDto } from "@passes/api-client"
import dynamic from "next/dynamic"
import DollarIcon from "public/icons/dollar-rounded-pink.svg"
import React, { FC, useCallback, useState } from "react"

const TipPostModal = dynamic(
  () => import("src/components/organisms/payment/TipPostModal"),
  { ssr: false }
)

interface TipButtonProps {
  postId: PostDto["postId"]
}

export const TipButton: FC<TipButtonProps> = ({ postId }) => {
  const [isTipModalOpen, setIsTipModalOpen] = useState(false)

  const openModal = useCallback(() => setIsTipModalOpen(true), [])

  return (
    <>
      <button aria-label="Tip post" onClick={openModal}>
        <DollarIcon />
      </button>
      {isTipModalOpen && (
        <TipPostModal
          isOpen={isTipModalOpen}
          setOpen={setIsTipModalOpen}
          postId={postId}
        />
      )}
    </>
  )
}
