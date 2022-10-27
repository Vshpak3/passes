import { useRouter } from "next/router"
import PlusSign from "public/icons/plus-sign.svg"
import { FC } from "react"

import { Button } from "src/components/atoms/Button"

interface BecomeCreatorButtonProps {
  isMobile?: boolean
  close?: () => void
}

export const BecomeCreatorButton: FC<BecomeCreatorButtonProps> = ({
  isMobile,
  close
}) => {
  const router = useRouter()
  const onClick = () => {
    if (close) {
      close()
    }
    router.push("/creator-flow")
  }
  return (
    <>
      <div className="flex items-center justify-center sidebar-collapse:hidden">
        <Button
          className={`flex h-12 w-12 items-center justify-center rounded-[50%] ${
            isMobile ? "hidden" : "sidebar-collapse:hidden"
          }`}
          onClick={onClick}
          variant="pink"
        >
          <PlusSign className="h-4 w-4 " />
        </Button>
      </div>
      <div className={`${isMobile ? "" : "hidden"} px-6 lg:flex`}>
        <Button
          onClick={onClick}
          className="mt-4 w-full max-w-sm border-none !px-8 !py-5 text-white transition-colors"
          variant="pink"
        >
          Become a Creator
        </Button>
      </div>
    </>
  )
}
