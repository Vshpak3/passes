import ArrowRightIcon from "public/icons/arrow-right.svg"
import { FC, PropsWithChildren } from "react"

import { formatText } from "src/helpers/formatters"

interface TabProps {
  title: string
}

export const Tab: FC<PropsWithChildren<TabProps>> = ({ title, children }) => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-passes-dark-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button className="mr-4">
              <ArrowRightIcon />
            </button>
            <h3 className="text-label-lg passes-break whitespace-pre-wrap">
              {formatText(title)}
            </h3>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
