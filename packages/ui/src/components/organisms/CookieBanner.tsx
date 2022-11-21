import Link from "next/link"
import UnionIcon from "public/icons/union-icon.svg"
import { FC } from "react"

import { Button, ButtonVariant } from "src/components/atoms/button/Button"
import { Text } from "src/components/atoms/Text"

interface CookieBannerProps {
  onAccept: () => void
  onReject: () => void
  onManage: () => void
}

export const CookieBanner: FC<CookieBannerProps> = ({
  onAccept,
  onManage,
  onReject
}) => {
  return (
    <div className="fixed bottom-5 left-0 z-[100] w-full lg:bottom-8">
      <div
        className="relative mx-auto flex min-h-[180px]
       w-full flex-col items-start gap-5 bg-[#191A1F] py-6 px-4 lg:h-32 lg:max-w-[1000px] lg:flex-row lg:items-center lg:rounded-lg lg:px-8"
      >
        <Text className="text-passes-gray-100 lg:flex-1">
          We use our own and third-party cookies to analyze traffic, enhance
          your experience, and for security and marketing. For more information,
          read our{" "}
          <Link className="underline" href="/cookies">
            Cookie Notice
          </Link>
          .
        </Text>
        <div className="flex flex-row-reverse items-center justify-between gap-2 lg:flex-row lg:gap-4">
          <div className="flex flex-col items-start lg:flex-row lg:items-center">
            <Button
              className="p-2 text-base font-bold text-passes-primary-color"
              onClick={onManage}
              variant={ButtonVariant.NONE}
            >
              Manage Settings
            </Button>
            <Button
              className="p-2 text-base font-bold text-passes-primary-color"
              onClick={onReject}
              variant={ButtonVariant.NONE}
            >
              Reject All
            </Button>
          </div>
          <Button
            className="py-4 px-2 text-base font-bold"
            icon={<UnionIcon className="mr-[5px]" />}
            onClick={onAccept}
          >
            Accept All
          </Button>
        </div>
      </div>
    </div>
  )
}
