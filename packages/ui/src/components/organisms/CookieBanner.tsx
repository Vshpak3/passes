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
    <div className="absolute bottom-10 left-0 z-20 w-full">
      <div className="relative mx-auto flex h-[164px] w-full max-w-[1272px] items-center gap-5 rounded-[5px] bg-[#191A1F] py-[53px] px-[58px]">
        <Text className="text-[#9D9D9D]">
          We use our own and third-party cookies to analyze traffic, enhance
          your experience, and for security and marketing. For more information,
          read our{" "}
          <Link className="underline" href="/">
            Cookie Notice
          </Link>
          .
        </Text>
        <div className="flex items-center justify-between gap-[10px]">
          <Button
            className="p-[8px] text-base font-bold text-[#FF51A8]"
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
            className="z-10 py-[19px] px-[26px] text-base font-bold"
            icon={<UnionIcon className="z-20 mr-[5px] space-y-3" />}
            onClick={() => onAccept()}
          >
            Accept All
          </Button>
        </div>
        <Button
          className="absolute right-[-20px] top-0"
          onClick={() => onClose()}
          variant={ButtonVariant.NONE}
        >
          <Cross />
        </Button>
      </div>
    </div>
  )
}
