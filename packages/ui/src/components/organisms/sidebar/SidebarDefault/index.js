import { differenceInYears } from "date-fns"
import dynamic from "next/dynamic"
import { SidebarComponents as SB } from "src/components/molecules"

import AuthWrapper from "../../../wrappers/AuthWrapper"
import ConditionalWrap from "../../../wrappers/ConditionalWrap"
import CreatorOnlyWrapper from "../../../wrappers/CreatorOnly"

export const MIN_CREATOR_AGE_IN_YEARS = 18

const NewPostButton = dynamic(() =>
  import("src/components/molecules/Sidebar/SidebarButtons/NewPostButton")
)

const SidebarDefault = ({
  active,
  navigation,
  setActive,
  router,
  handleLogout,
  openCollapsedAdditionalSidebar,
  closeCollapsedAdditionalSidebar,
  collapsedAdditionalSidebarOpen,
  collapsedNavigation,
  user
}) => {
  const renderSidebarItems = navigation.map((item) => {
    const child = !item.children ? (
      <SB.SidebarItem
        key={`sidebar-${item.id}`}
        isActive={item.id === active}
        item={item}
        onClick={() => setActive(item.id)}
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
      <ConditionalWrap
        key={`sidebar-${item.id}`}
        if={item.creatorOnly !== false}
        wrapper={CreatorOnlyWrapper}
      >
        <ConditionalWrap
          if={!item.showWithoutAuth && !item.creatorOnly}
          wrapper={AuthWrapper}
        >
          {child}
        </ConditionalWrap>
      </ConditionalWrap>
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
            <CreatorOnlyWrapper>
              <SB.CreatorToolsItem
                active={active}
                openCollapsedAdditionalSidebar={openCollapsedAdditionalSidebar}
              />
            </CreatorOnlyWrapper>
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
          <SB.LogoutButton handleLogout={handleLogout} />
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
