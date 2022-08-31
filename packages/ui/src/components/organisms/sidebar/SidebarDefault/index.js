import { SidebarComponents as SB } from "src/components/molecules"

import AuthOnlyWrapper from "../../../wrappers/AuthOnly"
import ConditionalWrap from "../../../wrappers/ConditionalWrap"
import CreatorOnlyWrapper from "../../../wrappers/CreatorOnly"

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
        if={item.creatorOnly}
        wrapper={CreatorOnlyWrapper}
      >
        <ConditionalWrap
          if={item.authOnly && !item.creatorOnly}
          wrapper={AuthOnlyWrapper}
        >
          {child}
        </ConditionalWrap>
      </ConditionalWrap>
    )
  })

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
            <AuthOnlyWrapper>
              {user?.isCreator ? (
                <SB.NewPostButton />
              ) : (
                <SB.BecomeCreatorButton />
              )}
            </AuthOnlyWrapper>
          </nav>
        </div>
        <AuthOnlyWrapper>
          <SB.LogoutButton handleLogout={handleLogout} />
        </AuthOnlyWrapper>
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
