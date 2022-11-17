import Link from "next/link"
import UnionIcon from "public/icons/union-icon.svg"
import { FC } from "react"

import { Button, ButtonVariant } from "src/components/atoms/button/Button"
import { Text } from "src/components/atoms/Text"
import { Cross } from "src/icons/CrossIcon"

interface CookieBannerProps {
  onClose(): void
  onAccept(): void
  onReject(): void
  onManage(): void
}

export const CookieBanner: FC<CookieBannerProps> = ({
  onAccept,
  onManage,
  onClose,
  onReject
}) => {
  return (
    <div className="fixed bottom-0 left-0 z-40 w-full lg:bottom-8">
      <div className="relative mx-auto flex h-48 w-full flex-col items-center gap-5 rounded-lg bg-[#191A1F] p-6 lg:h-32 lg:max-w-[1272px] lg:flex-row lg:p-8">
        <Text className="text-passes-gray-100">
          We use our own and third-party cookies to analyze traffic, enhance
          your experience, and for security and marketing. For more information,
          read our{" "}
          <Link className="underline" href="/">
            Cookie Notice
          </Link>
          .
        </Text>
        <div className="flex items-center justify-between gap-2 lg:gap-4">
          <Button
            className="p-2 text-base font-bold text-[#FF51A8]"
            onClick={() => onManage()}
            variant={ButtonVariant.NONE}
          >
            Manage Settings
          </Button>
          <Button
            className="p-[8px] text-base font-bold text-[#FF51A8]"
            onClick={() => onReject()}
            variant={ButtonVariant.NONE}
          >
            Reject All
          </Button>
          <Button
            className="py-4 px-2 text-base font-bold"
            icon={<UnionIcon className="mr-[5px]" />}
            onClick={() => onAccept()}
          >
            Accept All
          </Button>
        </div>
        <Button
          className="absolute right-0 top-0"
          onClick={() => onClose()}
          variant={ButtonVariant.NONE}
        >
          <Cross />
        </Button>
      </div>
    </div>
  )
}
