import Link from "next/link"
import LogoSmall from "public/icons/sidebar-logo-small.svg"
import { FC } from "react"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

export const NotFoundPage: FC = () => (
  <div className="flex w-full items-center justify-center pt-[60px]">
    <div className="flex w-[500px] flex-col items-center justify-center gap-[15px] text-center">
      <div className="h-[56px] w-[56px]">
        <LogoSmall />
      </div>
      <h1 className="mt-4 text-[32px] font-bold leading-[42px] text-white">
        Page not found
      </h1>
      <span className="font-base text-[16px] leading-6 text-[#ffffff] opacity-50">
        The page you are looking for may have expired or been removed. If you
        typed the address, double-check the spelling.
      </span>
      <Link href="/home">
        <span className="cursor-pointer text-base font-medium leading-6 text-passes-primary-color">
          Back to Passes home
        </span>
      </Link>
    </div>
  </div>
)

export default WithNormalPageLayout(NotFoundPage, { skipAuth: true })
