import { MonogramIcon } from "src/components/atoms"

const EmptyResult = () => (
  <li className="my-4 pl-6 text-[#ffffff]/30">
    <div>Try searching for creators.</div>
  </li>
)

const SearchResult = ({ fullName, username, onClick }) => {
  const formattedUsername = `@${username}`
  return (
    <li
      onClick={onClick}
      className=" grid cursor-pointer grid-flow-col grid-rows-2 place-content-start gap-0 py-3 text-[#ffffff]/90 hover:bg-[#1b141d]/90"
    >
      <div className="align-items col-span-1 row-span-2 flex w-[75px] items-center justify-center">
        {/* 
          TODO: 
          We need to be able to fetch user images.
          For now we can use the monogram if user
          does not exist.
        */}
        {/* <img // eslint-disable-line @next/next/no-img-element
          className="align-items flex h-[42px] w-[42px]"
          src="/pages/profile/header-profile-photo.png"
          alt=""
        /> */}
        <MonogramIcon fullName={fullName} />
      </div>
      <div className="align-start col-start-2 row-span-2 w-full content-start">
        <div className="text-[16px] font-medium">{fullName}</div>
        <div className="text-[12px] text-[#ffffff]/60">{formattedUsername}</div>
      </div>
    </li>
  )
}

export { EmptyResult, SearchResult }
