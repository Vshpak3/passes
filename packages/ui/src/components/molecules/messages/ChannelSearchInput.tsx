import { Combobox } from "@headlessui/react"
import { FC } from "react"

interface SearchInputDropdownProps {
  handleSearch: any
}

export const ChannelSearchInput: FC<SearchInputDropdownProps> = ({
  handleSearch
}) => {
  return (
    <Combobox as="div">
      <div className="relative">
        <Combobox.Input
          placeholder="Search people.."
          className="box-border flex w-full items-start justify-between gap-[10px] rounded-md border border-passes-dark-200 bg-[#100C11] p-[12px] text-sm outline-0 ring-0 focus:border-passes-dark-200 focus:outline-none focus:ring-0"
          onChange={handleSearch}
        />
      </div>
    </Combobox>
  )
}
