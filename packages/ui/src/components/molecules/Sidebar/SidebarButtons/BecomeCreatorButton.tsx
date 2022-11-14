import classNames from "classnames"
// import { useRouter } from "next/router"
import { FC } from "react"

import { Button } from "src/components/atoms/button/Button"

interface BecomeCreatorButtonProps {
  isTablet?: boolean
}

export const BecomeCreatorButton: FC<BecomeCreatorButtonProps> = ({
  isTablet = true
}) => {
  // const router = useRouter()
  const onClick = () => {
    window.open("https://wb5kmiut0wz.typeform.com/to/qpCvL9Aa")
    // router.push("/creator-flow")
  }

  return (
    <div className={classNames({ hidden: isTablet })}>
      <div className="flex px-6">
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
