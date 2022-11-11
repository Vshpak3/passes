import classNames from "classnames"
import { CSSProperties, FC } from "react"

import { SectionTitle } from "src/components/atoms/SectionTitle"
import { CreatorSearchBar } from "./CreatorSearchBar"

interface HeaderProps {
  headerTitle?: string
  headerClassName?: string
  style?: CSSProperties
}
export const Header: FC<HeaderProps> = ({
  headerTitle,
  headerClassName,
  style
}: HeaderProps) => {
  return (
    <div
      className={classNames(
        "col-span-12 flex h-16 justify-between border-b-[0.5px] border-passes-gray pt-2 lg:col-span-7",
        headerClassName
      )}
      style={style}
    >
      <div className="flex-1">
        {!!headerTitle && (
          <SectionTitle className="ml-4 mt-3 hidden lg:block">
            {headerTitle}
          </SectionTitle>
        )}
      </div>
      <span className="mr-8 hidden lg:block">
        <CreatorSearchBar />
      </span>
    </div>
  )
}
