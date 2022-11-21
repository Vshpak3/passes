import ArrowRightIcon from "public/icons/arrow-right.svg"
import { FC, PropsWithChildren } from "react"

import { SubTabsEnum } from "src/config/settings"
import { SettingsContextProps, useSettings } from "src/contexts/Settings"
import { formatText } from "src/helpers/formatters"

interface TabProps {
  title: string
  description?: string
  isRootTab?: boolean
  TitleBtn?: React.ReactNode
  defaultSubTab?: SubTabsEnum
}

export const Tab: FC<PropsWithChildren<TabProps>> = ({
  title,
  description,
  children,
  isRootTab = false,
  TitleBtn,
  defaultSubTab
}) => {
  const { popTabFromStackHandler, navFromActiveTab } =
    useSettings() as SettingsContextProps

  return (
    <>
      <div className="w-full border-b border-passes-dark-200 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isRootTab ? (
              <button
                className="mr-3 md:hidden"
                onClick={() => navFromActiveTab()}
              >
                <ArrowRightIcon />
              </button>
            ) : (
              <button
                className="mr-4"
                onClick={() => popTabFromStackHandler(defaultSubTab)}
              >
                <ArrowRightIcon />
              </button>
            )}
            <h3 className="text-label-lg passes-break whitespace-pre-wrap">
              {formatText(title)}
            </h3>
          </div>
          {TitleBtn}
        </div>
        {!!description && (
          <p className="passes-break mt-3 text-xs font-medium text-white/50 sm:text-base md:text-base">
            {description}
          </p>
        )}
      </div>
      {children}
    </>
  )
}
