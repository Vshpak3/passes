import { Combobox } from "@headlessui/react"
import classNames from "classnames"
import SearchIcon from "public/icons/messages-search-icon.svg"
import { FC } from "react"

import { CustomResult } from "src/components/atoms/search/user/UserSearchResults"

interface SearchBarProps {
  searchValue: string
  loading: boolean
  options: JSX.Element[]
  onInputChange: (e: any) => void
  placeholder: string
  emptyText: string
  isDesktop?: boolean
  onSelect?: (value: any) => void
}

export const SearchBar: FC<SearchBarProps> = ({
  searchValue,
  loading,
  options,
  onInputChange,
  placeholder,
  emptyText,
  onSelect,
  isDesktop = true
}) => {
  return (
    <Combobox value={searchValue} onChange={onSelect}>
      <div className="relative flex flex-col">
        <Combobox.Button as="div">
          <div className="relative flex items-center gap-3">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-[14px] -translate-y-1/2 transform" />
            <Combobox.Input
              id="search"
              type="search"
              name="search"
              placeholder={placeholder}
              value={searchValue}
              autoComplete="off"
              onChange={onInputChange}
              className="form-input h-[51px] w-full rounded-md border border-[#ffffff]/10 bg-[#1b141d]/50 pl-11 text-[#ffffff] outline-none placeholder:text-[16px] placeholder:text-[#ffffff]/30 focus:border-[#ffffff]/10 focus:ring-0 xs:min-w-[320px] sm:min-w-[360px]"
            />
          </div>
        </Combobox.Button>
        <Combobox.Options
          className={classNames(
            "absolute top-14 z-10 w-full overflow-y-auto rounded-md border border-[#ffffff]/10 bg-[#1b141d]/80 outline-none",
            { "max-h-[165px]": isDesktop }
          )}
        >
          {options.length ? (
            options
          ) : searchValue && loading ? (
            <CustomResult text="Loading..." />
          ) : searchValue && !loading ? (
            <CustomResult text={`Found no ${emptyText}`} />
          ) : (
            <CustomResult text={`Search for ${emptyText}`} />
          )}
        </Combobox.Options>
      </div>
    </Combobox>
  )
}
