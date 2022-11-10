import SearchIcon from "public/icons/header-search-icon-2.svg"
import React, { FC } from "react"

interface PassSearchBarProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  passSearchTerm: any
}

export const PassSearchBar: FC<PassSearchBarProps> = ({
  onChange,
  passSearchTerm
}) => (
  <div className="ml-auto">
    <div className="relative flex items-center">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-[14px] -translate-y-1/2" />
      <input
        autoComplete="off"
        className="form-input h-[51px] w-[210px] rounded-md border border-[#ffffff]/10 bg-[#12070E]/50 pl-11 text-[#ffffff] outline-none placeholder:text-[16px] placeholder:text-[#ffffff]/30 focus:border-[#ffffff]/10 focus:ring-0 md:max-w-[250px]"
        id="search-passes"
        name="search-passes"
        onChange={onChange}
        placeholder="Search memberships"
        type="search"
        value={passSearchTerm}
      />
    </div>
  </div>
)
