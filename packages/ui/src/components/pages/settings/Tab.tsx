import ArrowRightIcon from "public/icons/arrow-right.svg"
import { FC, PropsWithChildren } from "react"

import { SettingsContextProps, useSettings } from "src/contexts/Settings"
import { formatText } from "src/helpers/formatters"

interface TabProps {
  title: string
  description?: string
  isRootTab?: boolean
  TitleBtn?: React.ReactNode
}

export const Tab: FC<PropsWithChildren<TabProps>> = ({
  title,
  description,
  children,
  isRootTab = false,
  TitleBtn
}) => {
  const { popTabFromStackHandler, clearActiveTab, setShowSettingsTab } =
    useSettings() as SettingsContextProps

  return (
    <>
      <div className="border-b border-passes-dark-200 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isRootTab ? (
              <button
                className="mr-3 md:hidden"
                onClick={() => {
                  setShowSettingsTab(false)
                  clearActiveTab()
                }}
              >
                <ArrowRightIcon />
              </button>
            ) : (
              <button className="mr-4" onClick={popTabFromStackHandler}>
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
