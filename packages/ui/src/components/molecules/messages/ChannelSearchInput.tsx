import { Combobox } from "@headlessui/react"
import SearchIcon from "public/icons/header-search-icon-2.svg"
import { FC } from "react"

interface SearchInputDropdownProps {
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

export const ChannelSearchInput: FC<SearchInputDropdownProps> = ({
  handleSearch,
  placeholder = "Search.."
}) => {
  return (
    <Combobox as="div">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-[14px] -translate-y-1/2" />
        <Combobox.Input
          className="box-border flex w-full items-start justify-between gap-[10px] rounded-md border border-passes-dark-200 bg-[#100C11] p-[12px] pl-10 text-sm outline-0 ring-0 focus:border-passes-pink-100/80 focus:outline-none focus:ring-passes-pink-100/80"
          onChange={handleSearch}
          placeholder={placeholder}
        />
      </div>
    </Combobox>
  )
}
