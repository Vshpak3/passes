import dynamic from "next/dynamic"
import React, { useState } from "react"
import { PostUnlockButton } from "src/components/atoms"
import { classNames } from "src/helpers"
const BuyPostModal = dynamic(
  () => import("src/components/organisms/BuyPostModal"),
  {
    ssr: false
  }
)

export const Content = () => {
  const [postUnlocked, setPostUnlocked] = useState(false)
  const [openBuyPostModal, setOpenBuyPostModal] = useState(false)

  const onSuccess = () => {
    setOpenBuyPostModal(false)
    setPostUnlocked(true)
  }

  return (
    <>
      <div className="relative my-4 w-full bg-transparent">
        <div
          className={classNames(
            postUnlocked ? "" : "bg-[#1B141D]/50 backdrop-blur-[40px]",
            "absolute top-0 flex h-full w-full items-center justify-center rounded-[20px]"
          )}
        >
          {!postUnlocked && (
            <div className="flex-center h-45 flex w-[245px] flex-col">
              <PostUnlockButton
                onClick={() => setOpenBuyPostModal(true)}
                value=""
                name="Unlock Post For $10"
              />
              <div className="flex items-center justify-center pt-4 text-[#ffffff]">
                <span>Unlock 4 videos, 20 photos</span>
              </div>
            </div>
          )}
        </div>
        <img // eslint-disable-line @next/next/no-img-element
          src="/pages/profile/profile-post-photo.png"
          alt=""
        />
      </div>
      <BuyPostModal setOpen={onSuccess} isOpen={openBuyPostModal} />
    </>
  )
}
