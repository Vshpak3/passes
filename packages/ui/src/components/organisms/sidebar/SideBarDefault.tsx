import { differenceInYears } from "date-fns"
import dynamic from "next/dynamic"
import LogoutIcon from "public/icons/sidebar-logout-icon.svg"
import { SidebarComponents as SB } from "src/components/molecules"
import AuthWrapper from "src/components/wrappers/AuthWrapper"
import { MIN_CREATOR_AGE_IN_YEARS } from "src/config/constants"
import { SidebarNavigation } from "src/layout/Sidebar/sidebarData"

const NewPostButton = dynamic(
  () => import("src/components/molecules/Sidebar/SidebarButtons/NewPostButton"),
  { ssr: false }
)

interface SidebarDefaultProps {
  active: any
  navigation: SidebarNavigation[]
  setActive: any
  router: any
  openCollapsedAdditionalSidebar: any
  closeCollapsedAdditionalSidebar: any
  collapsedAdditionalSidebarOpen: any
  collapsedNavigation: any
  user: any
}

const SidebarDefault = ({
  active,
  navigation,
  setActive,
  router,
  openCollapsedAdditionalSidebar,
  closeCollapsedAdditionalSidebar,
  collapsedAdditionalSidebarOpen,
  collapsedNavigation,
  user
}: SidebarDefaultProps) => {
  const renderSidebarItems = navigation.map((item: SidebarNavigation) => {
    const child = !item.children ? (
      <SB.SidebarItem
        key={`sidebar-${item.id}`}
        isActive={item.id === active}
        item={item}
        setActive={() => setActive(item.id)}
      />
    ) : (
      <SB.SidebarDropdown
        key={`sidebar-${item.id}`}
        active={active}
        item={item}
        setActive={setActive}
        router={router}
      />
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
      <SB.SidebarContainer>
        <div className="">
          <SB.SidebarHeader />
          <nav className="flex flex-col items-center gap-3 pt-[50px] sidebar-collapse:items-start sidebar-collapse:gap-[0px]">
            {renderSidebarItems}
            <AuthWrapper creatorOnly={true}>
              <SB.CreatorToolsItem
                active={active}
                openCollapsedAdditionalSidebar={openCollapsedAdditionalSidebar}
              />
            </AuthWrapper>
            {user ? (
              <AuthWrapper>
                {user?.isCreator ? (
                  <NewPostButton />
                ) : isOver18 ? (
                  <SB.BecomeCreatorButton />
                ) : null}
              </AuthWrapper>
            ) : null}
          </nav>
        </div>
        <AuthWrapper>
          <div className="flex flex-col items-center gap-3 sidebar-collapse:items-start sidebar-collapse:gap-[0px]">
            <SB.SidebarItem
              key={`sidebar-logout`}
              item={{
                name: "Logout",
                id: "logout",
                icon: LogoutIcon,
                href: "/logout"
              }}
              isActive={false}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              setActive={() => {}}
            />
          </div>
        </AuthWrapper>
      </SB.SidebarContainer>
      <SB.CreatorToolsSidebar
        active={active}
        collapsedAdditionalSidebarOpen={collapsedAdditionalSidebarOpen}
        closeCollapsedAdditionalSidebar={closeCollapsedAdditionalSidebar}
        collapsedNavigation={collapsedNavigation}
        setActive={setActive}
      />
    </>
  )
}

export default SidebarDefault
