import { PassDto } from "@passes/api-client"
import classNames from "classnames"
import { FC, useState } from "react"
import { PassMedia } from "src/components/atoms/passes/PassMedia"
import { CreatorPassModal } from "src/components/organisms/CreatorPassModal"

interface PassTilesProps {
  pass: PassDto
  alternateBg?: boolean
}

export const PassTile: FC<PassTilesProps> = ({ pass, alternateBg = false }) => {
  const [isModalOpen, setModalOpen] = useState(false)

  const handleClick = () => {
    setModalOpen(true)
  }
  return (
    <>
      <div
        className={classNames(
          alternateBg
            ? "bg-gradient-to-r from-passes-blue-100 to-[#e292b3]"
            : "bg-gradient-to-r from-[#a159d3] to-passes-blue-100",
          "col-span-1 min-h-[213px] min-w-[260px] max-w-[260px] cursor-pointer rounded-lg p-4 drop-shadow transition-colors"
        )}
        onClick={handleClick}
      >
        <PassMedia
          passId={pass.passId}
          imageType={pass.imageType}
          animationType={pass.animationType}
        />
        <div className="grid h-full grid-flow-row gap-6 p-2">
          <div className="row-span-1 flex h-[55px] items-start justify-start">
            <span className="text-2xl font-bold text-[#ffff]/90">
              {pass.title}
            </span>
          </div>
          <div className="row-span-1 flex items-start justify-start text-lg text-[#ffff]/90">
            <span className="font-bold">{pass.price.toFixed(2)}</span>
            <span className="ml-2 font-light">/30 days</span>
          </div>
        </div>
      </div>
      <CreatorPassModal
        isOpen={isModalOpen}
        setOpen={setModalOpen}
        pass={pass}
      />
    </>
  )
}
