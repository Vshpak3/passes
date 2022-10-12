import { differenceInYears } from "date-fns"
import dynamic from "next/dynamic"
import LogoutIcon from "public/icons/sidebar-logout-icon.svg"
import { useState } from "react"
import { BecomeCreatorButton } from "src/components/molecules/Sidebar/SidebarButtons/BecomeCreatorButton"
import { CreatorToolsItem } from "src/components/molecules/Sidebar/SidebarLayout/CreatorToolsItem"
import { CreatorToolsSidebar } from "src/components/molecules/Sidebar/SidebarLayout/CreatorToolsSidebar"
import { SidebarContainer } from "src/components/molecules/Sidebar/SidebarLayout/SidebarContainer"
import { SidebarHeader } from "src/components/molecules/Sidebar/SidebarLayout/SidebarHeader"
import {
  SidebarDropdown,
  SidebarItem
} from "src/components/molecules/Sidebar/SidebarLayout/SidebarItems"
import { SidebarNavigation } from "src/components/molecules/Sidebar/SidebarLayout/types"
import { AuthWrapper } from "src/components/wrappers/AuthWrapper"
import { MIN_CREATOR_AGE_IN_YEARS } from "src/config/constants"
import { useUser } from "src/hooks/useUser"

const NewPostButton = dynamic(
  () => import("src/components/molecules/Sidebar/SidebarButtons/NewPostButton"),
  { ssr: false }
)

interface SidebarDefaultProps {
  navigation: SidebarNavigation[]
  active: string
}

export const SidebarDefault: React.FC<SidebarDefaultProps> = ({
  navigation,
  active
}) => {
  const { user } = useUser()
  // TODO: sidebar open will be used for mobile sidebar
  const [collapsedAdditionalSidebarOpen, setCollapsedAdditionalSidebarOpen] =
    useState(false)

  const openCollapsedAdditionalSidebar = () => {
    setCollapsedAdditionalSidebarOpen(true)
  }

  const closeCollapsedAdditionalSidebar = () => {
    setCollapsedAdditionalSidebarOpen(false)
  }

  const renderSidebarItems = navigation.map((item: SidebarNavigation) => {
    const child = !item.children ? (
      <SidebarItem
        key={`sidebar-${item.id}`}
        isActive={item.id === active}
        item={item}
      />
    ) : (
      <SidebarDropdown key={`sidebar-${item.id}`} active={active} item={item} />
    )

    return (
      <AuthWrapper
        key={`sidebar-${item.id}`}
        skipAuth={item.showWithoutAuth}
        creatorOnly={item.creatorOnly !== false}
      >
        {child}
      </AuthWrapper>
    )
  })

  const isOver18 = user?.birthday
    ? differenceInYears(new Date(), new Date(user?.birthday)) >=
      MIN_CREATOR_AGE_IN_YEARS
    : false

  return (
    <>
      <SidebarContainer>
        <div className="">
          <SidebarHeader />
          <nav className="flex flex-col items-center gap-3 pt-[50px] sidebar-collapse:items-start sidebar-collapse:gap-[0px]">
            {renderSidebarItems}
            <AuthWrapper creatorOnly={true}>
              <CreatorToolsItem
                active={active}
                openCollapsedAdditionalSidebar={openCollapsedAdditionalSidebar}
              />
            </AuthWrapper>
            {user ? (
              <AuthWrapper>
                {user?.isCreator ? (
                  <NewPostButton />
                ) : isOver18 ? (
                  <BecomeCreatorButton />
                ) : null}
              </AuthWrapper>
            ) : null}
          </nav>
        </div>
        <AuthWrapper>
          <div className="flex flex-col items-center gap-3 sidebar-collapse:items-start sidebar-collapse:gap-[0px]">
            <SidebarItem
              key={`sidebar-logout`}
              item={{
                name: "Logout",
                id: "logout",
                icon: LogoutIcon,
                href: "/logout"
              }}
              isActive={false}
            />
          </div>
        </AuthWrapper>
      </SidebarContainer>
      <CreatorToolsSidebar
        active={active}
        collapsedAdditionalSidebarOpen={collapsedAdditionalSidebarOpen}
        closeCollapsedAdditionalSidebar={closeCollapsedAdditionalSidebar}
      />
    </>
  )
}
