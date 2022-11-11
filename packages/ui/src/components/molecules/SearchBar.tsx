import { Combobox } from "@headlessui/react"
import SearchIcon from "public/icons/messages-search-icon.svg"
import { ChangeEvent, PropsWithChildren } from "react"

import { CustomResult } from "src/components/atoms/search/CustomResult"

interface SearchBarProps<T> {
  searchValue: string
  loading: boolean
  options: JSX.Element[]
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void
  onSelect: (value: T) => void
  contentName: string
}

export const SearchBar = <T,>({
  searchValue,
  loading,
  options,
  onInputChange,
  onSelect,
  contentName
}: PropsWithChildren<SearchBarProps<T>>) => {
  return (
    <Combobox<T> onChange={onSelect} value={searchValue as unknown as T}>
      <div className="relative flex w-full flex-col">
        <Combobox.Button as="div">
          <div className="relative flex items-center gap-3">
            <SearchIcon
              className="pointer-events-none absolute top-1/2 left-[14px] -translate-y-1/2"
              height="20"
              width="20"
            />
            <Combobox.Input
              autoComplete="off"
              className="form-input h-[51px] w-full rounded-md border border-[#ffffff]/10 bg-[#12070E]/50 pl-11 text-[#ffffff] outline-none placeholder:text-[16px] placeholder:text-[#ffffff]/30 focus:border-[#ffffff]/10 focus:ring-0"
              id="search"
              name="search"
              onChange={onInputChange}
              placeholder={`Find ${contentName}`}
              type="search"
              value={searchValue}
            />
          </div>
        </Combobox.Button>
        <Combobox.Options className="absolute top-14 z-10 w-full overflow-y-hidden rounded-md border border-[#ffffff]/10 bg-[#1b141d] outline-none">
          {options.length ? (
            options
          ) : searchValue && loading ? (
            <CustomResult text="Loading..." />
          ) : searchValue && !loading ? (
            <CustomResult text={`Found no ${contentName}`} />
          ) : (
            <CustomResult text={`Search for ${contentName}`} />
          )}
        </Combobox.Options>
      </div>
    </Combobox>
  )
}
