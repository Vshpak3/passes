import classNames from "classnames"
import { useRouter } from "next/router"
import ChevronRightIcon from "public/icons/chevron-right-icon.svg"
import { Dispatch, FC } from "react"

import { AdminTabProps } from "src/config/admin"
import { useWindowSize } from "src/hooks/useWindowSizeHook"
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
  const { isTablet } = useWindowSize()

  return (
    <>
      {(!isTablet || !window.location.hash.slice(1)) && (
        <div className="absolute z-20 h-full w-full overflow-x-hidden border-passes-dark-200 bg-passes-black lg:relative lg:w-[400px] lg:overflow-y-auto lg:border-r">
          <SettingsSearchBar setValue={setSearchText} value={searchText} />
          <div className="mx-auto h-fit w-full ">
            <ul className="">
              {tabs.map(({ name, id }) => (
                <li
                  className={classNames(
                    "rounded-l-[4px] p-2.5 pr-[13px]",
                    id === window.location.hash.slice(1)
                      ? "md:border-r md:border-passes-primary-color md:bg-passes-primary-color/25"
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
        </div>
      )}
    </>
  )
}
