import { Combobox } from "@headlessui/react"
import { UserDisplayInfoDto } from "@passes/api-client"
import classNames from "classnames"
import SearchIcon from "public/icons/messages-search-icon.svg"
import React from "react"
import {
  EmptyResult,
  SearchResult
} from "src/components/atoms/search/user/UserSearchResults"

interface SearchBarProps {
  searchValue: string
  results: UserDisplayInfoDto[]
  onSelect: (value: string) => any
  onChange: (e: any) => void
  placeholder: string
  emptyText: string
  isDesktop?: boolean
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchValue,
  results,
  onSelect,
  onChange,
  placeholder,
  emptyText,
  isDesktop = true
}) => {
  return (
    <Combobox value={searchValue} onChange={onSelect}>
      <div className="flex flex-col">
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
              onChange={onChange}
              className="form-input h-[51px] w-full rounded-md border border-[#ffffff]/10 bg-[#1b141d]/50 pl-11 text-[#ffffff] outline-none placeholder:text-[16px] placeholder:text-[#ffffff]/30 focus:border-[#ffffff]/10 focus:ring-0 xs:min-w-[320px] sm:min-w-[360px]"
            />
          </div>
        </Combobox.Button>
        <Combobox.Options
          className={classNames(
            isDesktop ? "max-h-[165px]" : "h-full w-full",
            {
              "absolute top-16 w-full pr-2 xs:right-2 xs:w-auto xs:pr-0":
                !isDesktop
            },
            "z-10 overflow-y-auto rounded-md border border-[#ffffff]/10 bg-[#1b141d]/80 outline-none xs:min-w-[320px] sm:min-w-[360px]"
          )}
        >
          {results.length ? (
            results.map((user: UserDisplayInfoDto) => (
              <SearchResult
                key={user.userId}
                userId={user.userId}
                displayName={user?.displayName ?? ""}
                username={user.username}
              />
            ))
          ) : (
            <EmptyResult text={emptyText} />
          )}
        </Combobox.Options>
      </div>
    </Combobox>
  )
}
