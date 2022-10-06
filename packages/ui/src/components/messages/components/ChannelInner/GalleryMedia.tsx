import classNames from "classnames"
import ImageIcon from "public/icons/messages-image-icon.svg"
import CostIcon from "public/icons/post-cost-icon.svg"
import { FC, useState } from "react"
import { PostUnlockButton } from "src/components/atoms"
import { formatCurrency } from "src/helpers"

interface GalleryMediaProps {
  media: any
  isCreator: any
}

export const GalleryMedia: FC<GalleryMediaProps> = ({ media, isCreator }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [openBuyPostModal, setOpenBuyPostModal] = useState(false)

  return (
    <div className="flex w-full flex-col items-start gap-3 rounded-[20px] border border-[#ffff]/20 bg-[#1b141d]/50 p-4 sm:max-w-[235px]">
      <div className="flex w-full items-center justify-between">
        <div className="flex cursor-pointer items-center justify-start gap-[6px]">
          <span className="text-[16px] font-medium leading-[22px] text-white ">
            {!media.locked ? "Purchased" : "Pending"}
          </span>
          <div className="flex items-center gap-1">
            <span>
              <CostIcon />
            </span>
            <span className="text-[16px] font-bold leading-[25px] text-white/90">
              {media.price}
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-[12px] font-medium uppercase leading-[12px] tracking-[1px] text-white opacity-50">
            {media.date}
          </span>
        </div>
      </div>
      <div>
        <p className="text-[16px] font-medium leading-[22px] text-white">
          Lorem ipsum dolor... Post description here.
        </p>
      </div>
      {isCreator ? (
        <div className="relative flex h-full w-full cursor-pointer items-center justify-center">
          <img
            src="/pages/messages/example-photo-gallery.png"
            className="rounded-[20px] object-fill backdrop-blur-[100px] "
            alt="photo"
            // TODO: use crop images when images come from our db
          />
          {!media.locked && (
            <div className="absolute top-0 flex h-full w-full items-center justify-center rounded-[20px] backdrop-blur-[100px]">
              <ImageIcon />
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="relative w-full bg-transparent ">
            <div
              className={classNames(
                !media.locked ? "" : "bg-[#1B141D]/50 backdrop-blur-[40px]",
                "absolute flex h-full w-full items-center justify-center rounded-[20px]"
              )}
            >
              {media.locked && (
                <div className="flex-center h-45 flex w-[245px] flex-col items-center ">
                  <PostUnlockButton
                    onClick={() => setOpenBuyPostModal(media)}
                    value={media.locked}
                    name={`Unlock For ${formatCurrency(media.price ?? 100)}`}
                    className="max-w-[165px] gap-1 py-2 text-[14px]"
                  />
                  <div className="flex items-center justify-center px-2 pt-4 text-[#ffffff]">
                    <span>Unlock 4 videos, 20 photos</span>
                  </div>
                </div>
              )}
            </div>
            <img
              src="/pages/messages/example-photo-gallery.png"
              alt=""
              className="w-full rounded-[20px] object-cover shadow-xl"
            />
          </div>
          {/* <BuyPostModal
            isOpen={openBuyPostModal}
            setOpen={setOpenBuyPostModal}
          /> */}
        </>
      )}
    </div>
  )
}
