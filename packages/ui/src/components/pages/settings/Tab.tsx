import ArrowRightIcon from "public/icons/arrow-right.svg"
import React from "react"
import { ISettingsContext, useSettings } from "src/contexts/settings"

interface ITabProps {
  title: string
  description?: string
  children?: React.ReactNode
  withBack?: boolean
  TitleBtn?: React.ReactNode
}

const Tab: React.FC<ITabProps> = ({
  title,
  description,
  children,
  withBack,
  TitleBtn
}) => {
  const { popTabFromStackHandler } = useSettings() as ISettingsContext

  return (
    <>
      <div className="border-b border-passes-dark-200 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {withBack && (
              <button className="mr-4" onClick={popTabFromStackHandler}>
                <ArrowRightIcon />
              </button>
            )}
            <h3 className="text-label-lg">{title}</h3>
          </div>
          {TitleBtn}
        </div>
        {description && (
          <p className="mt-3 text-base font-medium text-white/50">
            {description}
          </p>
        )}
      </div>
      {children}
    </>
  )
}

export default Tab
