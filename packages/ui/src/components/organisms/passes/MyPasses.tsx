import PlusSquareIcon from "public/icons/plus-square.svg"
import React, { FC } from "react"
import { Button } from "src/components/atoms/Button"
import { Passes } from "src/components/molecules/pass/Passes"

interface PassesListSectionProps {
  onCreatePass: any
  subscriptionPasses: any
  lifetimePasses: any
}

export const PassesListSection: FC<PassesListSectionProps> = ({
  onCreatePass,
  subscriptionPasses,
  lifetimePasses
}) => {
  return (
    <div className="col-auto mx-auto mb-[70px] grid w-full justify-center gap-5 px-0 sm:w-[653px] md:w-[653px] lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
      <div className="align-items -mt-[170px] flex grid grid-cols-2 grid-rows-2 sidebar-collapse:-mt-[150px]">
        <div className="align-items col-span-2 row-span-1 text-[24px] font-bold text-white sidebar-collapse:col-span-1">
          Manage Passes
        </div>
        <div className="align-items col-span-2 row-span-1 flex items-end pb-[22px] font-bold text-white md:row-span-2 md:justify-end">
          <Button
            className="border-none !px-[34.5px] !py-[10px] text-black transition-colors hover:bg-mauve-mauve12 hover:text-white sidebar-collapse:w-[195px]"
            variant="purple"
            onClick={onCreatePass}
          >
            <PlusSquareIcon />
            Create Pass
          </Button>
        </div>
      </div>
      <Passes passes={subscriptionPasses} title="Subscription" />
      <Passes passes={lifetimePasses} title="Lifetime" />
    </div>
  )
}
