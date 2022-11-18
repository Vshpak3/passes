import PassesLogoPink from "public/icons/passes-logo-pink.svg"
import { FC, PropsWithChildren } from "react"

interface LegalPageProps {
  title: string
}

export const LegalPage: FC<PropsWithChildren<LegalPageProps>> = ({
  title,
  children
}) => {
  return (
    <div className="bg-white pt-10 text-black dark:bg-black dark:text-white">
      <div className="mx-10 mt-20 md:mx-20 lg:mx-40 xl:mx-52">
        <PassesLogoPink className="mb-7 block h-[50x] w-[50px] fill-current" />
        <h1 className="text-[24px] font-bold">{title}</h1>
        <br />
        {children}
        <br />
      </div>
    </div>
  )
}
