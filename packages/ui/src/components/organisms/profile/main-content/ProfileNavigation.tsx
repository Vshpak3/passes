import classNames from "classnames"
import { Dispatch, FC, SetStateAction } from "react"

const navigationTabs = [
  {
    id: "post",
    name: "Post"
  },
  {
    id: "fanWall",
    name: "Fan Wall"
  },
  {
    id: "passes",
    name: "Passes"
  }
]

interface ProfileNavigationProps {
  setActiveTab: Dispatch<SetStateAction<string>>
  activeTab: string
}

const ProfileNavigation: FC<ProfileNavigationProps> = ({
  setActiveTab,
  activeTab
}) => {
  return (
    <div className="flex md:min-h-12">
      <nav className="align-items md:w-min-content mb-2 flex grid w-full grid-cols-3 items-center justify-center border-b border-passes-dark-200 p-0 md:grid-cols-7 md:items-start md:justify-start">
        {navigationTabs.map((item, index) => (
          <span
            key={index}
            onClick={() => setActiveTab(item.id)}
            className={classNames(
              activeTab === item.id
                ? "border-b-[3px] border-passes-primary-color"
                : "border-b-[3px] border-b-transparent hover:border-passes-primary-color",
              "align-center group box-border flex w-full cursor-pointer justify-center py-[10px] md:mr-8 md:mt-[7px] md:w-[90px] md:pb-3"
            )}
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
    </div>
  )
}

export default ProfileNavigation
