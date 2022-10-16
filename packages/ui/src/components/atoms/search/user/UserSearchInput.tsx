import classNames from "classnames"
import SearchIcon from "public/icons/header-search-icon-2.svg"
import React, { FC } from "react"

interface UserSearchInputProps {
  onChangeInput: (value: any) => void
  onSearchFocus: () => void
  searchValue: string
  placeholder: string
  isDesktop?: boolean
}

export const UserSearchInput: FC<UserSearchInputProps> = ({
  onChangeInput,
  onSearchFocus,
  searchValue,
  placeholder,
  isDesktop = true
}) => {
  return (
    <div
      className={classNames(
        isDesktop ? "hidden md:flex" : "mr-2 flex-grow",
        "items-center justify-end md:flex"
      )}
    >
      <div className="relative flex items-center gap-3">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-[14px] -translate-y-1/2 transform" />
        <input
          type="search"
          name="search"
          id="search"
          onChange={onChangeInput}
          onFocus={onSearchFocus}
          value={searchValue}
          autoComplete="off"
          placeholder={placeholder}
          className="form-input h-[51px] w-full rounded-md border border-[#ffffff]/10 bg-[#1b141d]/50 pl-11 text-[#ffffff] outline-none placeholder:text-[16px] placeholder:text-[#ffffff]/30 focus:border-[#ffffff]/10 focus:ring-0 xs:min-w-[320px] sm:min-w-[360px]"
        />
      </div>
    </div>
  )
}
