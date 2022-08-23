import SearchIcon from "public/icons/header-search-icon-2.svg"
import React from "react"

const CreatorSearchBar = () => {
  return (
    <div className="hidden items-center justify-end gap-2 pr-10 pt-4 md:flex">
      <div className="relative flex items-center gap-3">
        <SearchIcon className="pointer-events-none  absolute top-1/2 left-[14px] -translate-y-1/2 transform" />
        <input
          type="search"
          name="search"
          id="search"
          placeholder="Find creator"
          className="form-input h-[51px] w-full min-w-[296px] rounded-md border border-[#ffffff]/10 bg-[#1b141d]/50 pl-11 text-[#ffffff] outline-none placeholder:text-[16px] placeholder:text-[#ffffff]/30 focus:border-[#ffffff]/10 focus:ring-0"
        />
      </div>
    </div>
  )
}
export default CreatorSearchBar
