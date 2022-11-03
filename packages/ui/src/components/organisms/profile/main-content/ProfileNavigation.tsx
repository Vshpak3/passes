import classNames from "classnames"
import { Dispatch, FC, SetStateAction } from "react"

export enum ProfileNavigationOptions {
  POST = "post",
  FANWALL = "fanwall",
  PASSES = "memberships"
}

const navigationTabs = [
  {
    id: ProfileNavigationOptions.POST,
    name: "Post"
  },
  {
    id: ProfileNavigationOptions.FANWALL,
    name: "Fan Wall"
  },
  {
    id: ProfileNavigationOptions.PASSES,
    name: "Memberships"
  }
]

interface ProfileNavigationProps {
  setActiveTab: Dispatch<SetStateAction<ProfileNavigationOptions>>
  activeTab: ProfileNavigationOptions
}

export const ProfileNavigation: FC<ProfileNavigationProps> = ({
  setActiveTab,
  activeTab
}) => {
  return (
    <nav className="mb-5 flex w-full items-center justify-center border-b border-passes-dark-200 p-0">
      {navigationTabs.map((item, index) => (
        <span
          className={classNames(
            activeTab === item.id
              ? "border-b-[3px] border-passes-primary-color"
              : "border-b-[3px] border-b-transparent hover:border-passes-primary-color",
            "align-center group mx-2 box-border flex w-full max-w-[300px] cursor-pointer justify-center py-[10px]"
          )}
          key={index}
          onClick={() => setActiveTab(item.id)}
        >
          <a
            className={classNames(
              item.id === activeTab
                ? "border-b-2 text-base font-bold opacity-100"
                : "opacity-50 group-hover:opacity-80",
              "inline-flex items-center justify-center border border-t-0 border-r-0 border-l-0 border-b-2 border-b-transparent text-center text-base font-bold text-[#ffffff]/90 "
            )}
          >
            {item.name}
          </a>
        </span>
      ))}
    </nav>
  )
}
