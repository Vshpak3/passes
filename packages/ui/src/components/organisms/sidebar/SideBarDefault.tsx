import LogoutIcon from "public/icons/sidebar-logout-icon.svg"
import { FC, useState } from "react"

import { BecomeCreatorButton } from "src/components/molecules/Sidebar/SidebarButtons/BecomeCreatorButton"
import { NewPostButton } from "src/components/molecules/Sidebar/SidebarButtons/NewPostButton"
import { CreatorToolsItem } from "src/components/molecules/Sidebar/SidebarLayout/CreatorToolsItem"
import { CreatorToolsSidebar } from "src/components/molecules/Sidebar/SidebarLayout/CreatorToolsSidebar"
import { SidebarContainer } from "src/components/molecules/Sidebar/SidebarLayout/SidebarContainer"
import { SidebarHeader } from "src/components/molecules/Sidebar/SidebarLayout/SidebarHeader"
import {
  SidebarDropdown,
  SidebarItem
} from "src/components/molecules/Sidebar/SidebarLayout/SidebarItems"
import { SidebarNavigation } from "src/components/molecules/Sidebar/SidebarLayout/Types"
import { AuthWrapper } from "src/components/wrappers/AuthWrapper"
import { isOver18 } from "src/helpers/isOver18"
import { useUser } from "src/hooks/useUser"
import { SidebarDefaultProps } from "./Types"

export const SidebarDefault: FC<SidebarDefaultProps> = ({
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
      <>
        <SidebarDropdown
          key={`sidebar-${item.id}`}
          active={active}
          item={item}
        />
        <CreatorToolsItem
          active={active}
          openCollapsedAdditionalSidebar={openCollapsedAdditionalSidebar}
        />
      </>
    )
    // TOOO: make the dropdown more generic
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

  return (
    <>
      <SidebarContainer>
        <div>
          <SidebarHeader />
          <nav className="flex flex-col items-center gap-3 pt-[35px] sidebar-collapse:items-start sidebar-collapse:gap-0">
            {renderSidebarItems}
            <AuthWrapper>
              {user?.isCreator ? (
                <NewPostButton />
              ) : isOver18(user) ? (
                <BecomeCreatorButton />
              ) : null}
            </AuthWrapper>
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
