import { SidebarComponents as SB } from "src/components/molecules"

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
  const renderSidebarItems = navigation.map((item) =>
    !item.children ? (
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
  )

  return (
    <>
      <SB.SidebarContainer>
        <div className="">
          <SB.SidebarHeader />
          <nav className="flex flex-col items-center gap-3 pt-[50px] sidebar-collapse:items-start sidebar-collapse:gap-[0px]">
            {renderSidebarItems}
            <SB.CreatorToolsItem
              active={active}
              openCollapsedAdditionalSidebar={openCollapsedAdditionalSidebar}
            />
            {user?.isCreator && <SB.NewPostButton />}
            {!user?.isCreator && <SB.BecomeCreatorButton />}
          </nav>
        </div>
        <SB.LogoutButton handleLogout={handleLogout} />
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
