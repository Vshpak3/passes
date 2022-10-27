import { CreatorSearchBar } from "src/layout/CreatorSearchBar"

export const Header = () => {
  return (
    <div className="cover-image h-16 flex-shrink-0 px-5 pt-16 md:h-16 md:pt-2 lg:pr-14">
      <div className="flex gap-x-6 py-4 md:py-0 lg:justify-end">
        <div className="hidden md:block">
          <CreatorSearchBar />
        </div>
      </div>
    </div>
  )
}
