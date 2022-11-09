import Link from "next/link"
import LogoSmall from "public/icons/logo-small.svg"

export const NoProfile = () => {
  return (
    <div className="grid w-full grid-cols-7">
      <div className="col-span-7 flex flex-col items-center px-8 pt-16 text-center lg:col-span-4">
        <div className="h-[56px] w-[56px]">
          <LogoSmall />
        </div>
        <h1 className="mt-4 text-[32px] font-bold leading-[42px] text-white">
          Profile does not exist
        </h1>
        <span className="text-[16px] leading-6 text-[#ffffff] opacity-50">
          The profile you are looking for may have expired or been removed. If
          you typed the address, double-check the spelling.
        </span>
        <Link href="/home">
          <span className="cursor-pointer text-base font-medium leading-6 text-passes-primary-color">
            Back to Passes home
          </span>
        </Link>
      </div>
      <div className="col-span-3 h-screen border-passes-gray lg:border-l-[0.5px]" />
    </div>
  )
}
