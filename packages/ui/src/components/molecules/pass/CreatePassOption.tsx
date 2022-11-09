import classNames from "classnames"
import { FC, ReactElement } from "react"

import { PassesPinkButton } from "src/components/atoms/button/PassesPinkButton"

interface CreatePassOptionProps {
  icon: ReactElement
  title: string
  subtitle: string
  onGetStarted: () => Promise<boolean>
  colStyle: string
}

export const CreatePassOption: FC<CreatePassOptionProps> = ({
  icon,
  title,
  subtitle,
  onGetStarted,
  colStyle
}) => {
  return (
    <div
      className={classNames("col-span-12 space-y-6 lg:max-w-[280px]", colStyle)}
    >
      <div className="flex grow flex-col items-stretch gap-4 border-y-[0.5px] border-[#3A444C]/[0.64] p-5 sm:px-10 md:min-h-[400px] md:px-10 md:pt-5 lg:px-5">
        <div className="mx-auto py-3">{icon}</div>
        <span className="mt-3 text-center text-[18px] font-bold text-white/90">
          {title}
        </span>
        <span className="text-center text-[14px] text-white/70">
          {subtitle}
        </span>
        <div className="mt-auto">
          <PassesPinkButton name="Get Started" onClick={onGetStarted} />
        </div>
      </div>
    </div>
  )
}
