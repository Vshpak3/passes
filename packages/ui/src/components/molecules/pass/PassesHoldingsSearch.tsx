import SearchIcon from "public/icons/header-search-icon-2.svg"
import React, { FC } from "react"

interface MyPassSearchBarProps {
  onChange: any
  passSearchTerm: any
}

export const MyPassSearchBar: FC<MyPassSearchBarProps> = ({
  onChange,
  passSearchTerm
}) => (
  <div className="ml-auto">
    <div className="relative flex items-center">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-[14px] -translate-y-1/2 transform" />
      <input
        type="search"
        name="search-passes"
        id="search-passes"
        onChange={onChange}
        value={passSearchTerm}
        autoComplete="off"
        placeholder="Search passes"
        className="form-input h-[51px] w-[210px] rounded-md border border-[#ffffff]/10 bg-[#1b141d]/50 pl-11 text-[#ffffff] outline-none placeholder:text-[16px] placeholder:text-[#ffffff]/30 focus:border-[#ffffff]/10 focus:ring-0 md:max-w-[250px]"
      />
    </div>
  </div>
)

interface MyPassSearchHeaderProps {
  onSearchPass: any
  passSearchTerm: any
  headerTitle?: string
}

export const MyPassSearchHeader: FC<MyPassSearchHeaderProps> = ({
  onSearchPass,
  passSearchTerm,
  headerTitle = "My Passes"
}) => {
  return (
    <div className="mx-auto mb-[70px] -mt-[180px] flex w-full items-center justify-center px-2 md:px-5 sidebar-collapse:-mt-[150px]">
      <div className="text-[24px] font-bold text-white">{headerTitle}</div>
      <MyPassSearchBar
        onChange={onSearchPass}
        passSearchTerm={passSearchTerm}
      />
    </div>
  )
}
