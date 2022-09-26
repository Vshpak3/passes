import { ContentService } from "../../../helpers"

const EmptyResult = () => (
  <li className="my-4 pl-6 text-[#ffffff]/30">
    <div>Try searching for creators.</div>
  </li>
)

const SearchResult = ({ userId, fullName, username, onClick }) => {
  const formattedUsername = `@${username}`
  return (
    <li
      onClick={onClick}
      className=" grid cursor-pointer grid-flow-col grid-rows-2 place-content-start gap-0 py-3 text-[#ffffff]/90 hover:bg-[#1b141d]/90"
    >
      <div className="align-items col-span-1 row-span-2 flex w-[75px] items-center justify-center">
        <div className="align-items flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#a78df0] p-[10px]">
          <p className="table-cell text-center text-[18px] font-bold no-underline ">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ContentService.profileImage(userId)} alt="" />
          </p>
        </div>
      </div>
      <div className="align-start col-start-2 row-span-2 w-full content-start">
        <div className="text-[16px] font-medium">{fullName}</div>
        <div className="text-[12px] text-[#ffffff]/60">{formattedUsername}</div>
      </div>
    </li>
  )
}

export { EmptyResult, SearchResult }
