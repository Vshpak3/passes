import CreatorSearchBar from "src/layout/CreatorSearchBar"

const Header = () => {
  return (
    <div className="cover-image h-16 flex-shrink-0 px-5 pt-16 md:h-[88px] md:pt-[17px] sidebar-collapse:pr-14">
      <div className="flex gap-x-6 py-4 md:py-0 sidebar-collapse:justify-end">
        <div className="hidden md:block">
          <CreatorSearchBar />
        </div>
      </div>
    </div>
  )
}

export default Header
