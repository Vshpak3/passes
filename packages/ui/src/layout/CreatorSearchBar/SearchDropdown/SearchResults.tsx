import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileComponents"

const EmptyResult = () => (
  <li className="my-4 pl-6 text-[#ffffff]/30">
    <div>Try searching for creators.</div>
  </li>
)

interface SearchResultProps {
  userId: string
  username: string
  displayName: string
  onClick: any
}

const SearchResult = ({
  userId,
  displayName,
  username,
  onClick
}: SearchResultProps) => {
  const formattedUsername = `@${username}`
  return (
    <li
      onClick={onClick}
      className="grid cursor-pointer grid-flow-col grid-rows-2 place-content-start gap-0 py-3 text-[#ffffff]/90 hover:bg-[#1b141d]/90"
    >
      <div className="col-span-1 row-span-2 flex w-[75px] items-center justify-center">
        <div className="col-span-1 row-span-2 flex w-[75px] items-center justify-center">
          <ProfileThumbnail userId={userId} />
        </div>
      </div>
      <div className="col-start-2 row-span-2 w-full content-start">
        <div className="text-[16px] font-medium">{displayName}</div>
        <div className="text-[12px] text-[#ffffff]/60">{formattedUsername}</div>
      </div>
    </li>
  )
}

export { EmptyResult, SearchResult }
