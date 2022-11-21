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
    <div className="h-full w-full bg-gray-900 text-white">
      <div className="p-10 md:py-28 md:px-20 xl:py-28 xl:px-52">
        <PassesLogoPink className="mb-7 block h-[50x] w-[50px] fill-current" />
        <h1 className="mb-4 text-2xl font-bold">{title}</h1>
        {children}
      </div>
    </div>
  )
}
