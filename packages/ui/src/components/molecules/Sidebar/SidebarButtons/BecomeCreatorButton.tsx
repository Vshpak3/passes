import classNames from "classnames"
// import { useRouter } from "next/router"
import PlusSign from "public/icons/plus-sign.svg"
import { FC } from "react"

import { Button } from "src/components/atoms/button/Button"

interface BecomeCreatorButtonProps {
  isMobile?: boolean
}

export const BecomeCreatorButton: FC<BecomeCreatorButtonProps> = ({
  isMobile
}) => {
  // const router = useRouter()
  const onClick = () => {
    window.open("https://wb5kmiut0wz.typeform.com/to/qpCvL9Aa")
    // router.push("/creator-flow")
  }

  return (
    <div className={classNames({ hidden: isMobile })}>
      <div className="my-4 flex items-center justify-center lg:hidden">
        <Button
          className="flex h-12 w-12 items-center justify-center rounded-[50%]"
          onClick={onClick}
        >
          <PlusSign className="h-4 w-4" />
        </Button>
      </div>
      <div className={`${isMobile ? "" : "hidden"} px-6 lg:flex`}>
        <Button
          className="mt-4 w-full max-w-sm border-none !px-8 !py-5 text-white transition-colors"
          onClick={onClick}
        >
          Become a Creator
        </Button>
      </div>
    </div>
  )
}
