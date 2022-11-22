import classNames from "classnames"
import { useRouter } from "next/router"
import ChevronRightIcon from "public/icons/chevron-right-icon.svg"
import { Dispatch, FC } from "react"

import { AdminTabProps } from "src/config/admin"
import { SettingsSearchBar } from "./SettingsSearchBar"

interface AdminSidebarProps {
  tabs: Array<AdminTabProps>
  searchText: string
  setSearchText: Dispatch<string>
}

export const AdminSidebar: FC<AdminSidebarProps> = ({
  tabs,
  searchText,
  setSearchText
}) => {
  const router = useRouter()

  return (
    <div className="absolute z-20 h-full w-full overflow-y-auto border-passes-dark-200 bg-passes-black lg:relative lg:w-[550px] lg:border-r">
      <SettingsSearchBar setValue={setSearchText} value={searchText} />
      <ul>
        {tabs.map(({ name, id }) => (
          <li
            className={classNames(
              "rounded-l-[4px] p-2.5 pr-[13px]",
              id === window.location.hash.slice(1)
                ? "border-r border-passes-primary-color bg-passes-primary-color/25"
                : "border-transparent"
            )}
            key={id}
            onClick={() => router.push(`/admin#${id}`)}
          >
            <button className="text-label flex w-full items-center justify-between">
              <span className="capitalize">{name}</span>
              <ChevronRightIcon />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
