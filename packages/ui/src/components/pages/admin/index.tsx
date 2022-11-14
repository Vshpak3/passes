/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable sonarjs/no-small-switch */
import classNames from "classnames"
import { useRouter } from "next/router"
import ChevronRightIcon from "public/icons/chevron-right-icon.svg"
import { useEffect, useState } from "react"

import { AdminTabs, AdminTabsEnum } from "src/config/admin"
import { useUser } from "src/hooks/useUser"
import { SettingsSearchBar } from "./SettingsSearchBar"
import { ImpersonateUser } from "./tabs/ImpersonateUser"

const ADMIN_EMAIL = "@passes.com"

export const Admin = () => {
  const { loading, user } = useUser()
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [activeTab, setActiveTab] = useState<AdminTabsEnum>(0)
  useEffect(() => {
    if (!router.isReady || loading) {
      return
    }
    setReady(true)
    if (!user || !user.email.endsWith(ADMIN_EMAIL)) {
      router.push("/home")
    } else {
      setReady(true)
    }
  }, [loading, router, user])

  const handleNavItemClick = (id: AdminTabsEnum) => {
    setActiveTab(id)
  }

  const renderTab = () => {
    switch (activeTab) {
      case AdminTabsEnum.ImpersonateUsers:
        return <ImpersonateUser />
      default: {
        return <></>
      }
    }
  }

  return (
    <>
      {ready && (
        <div className="flex h-screen w-full flex-col">
          <div className="flex w-full items-center justify-between px-2 py-4">
            <span className="text-xl font-bold">Admin</span>
            <SettingsSearchBar onSelect={handleNavItemClick} />
          </div>
          <div className=" flex flex-1 flex-row border-t-[1px] border-passes-dark-200">
            <div className="h-full overflow-y-auto overflow-x-hidden md:block md:min-w-[330px]">
              <div className="mx-auto h-full w-full border-passes-dark-200 pt-2 md:border-r">
                <ul className="">
                  {AdminTabs.map(({ name, id }) => (
                    <li
                      className={classNames(
                        "rounded-l-[4px] p-2.5 pr-[13px]",
                        id === activeTab
                          ? "md:border-r md:border-passes-primary-color md:bg-passes-primary-color/25"
                          : "border-transparent"
                      )}
                      key={id}
                      onClick={() => handleNavItemClick(id)}
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
            {renderTab()}
          </div>
        </div>
      )}
    </>
  )
}
