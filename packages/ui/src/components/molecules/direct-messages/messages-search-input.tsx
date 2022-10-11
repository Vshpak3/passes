import SearchIcon from "public/icons/messages-search-icon.svg"
import React, { FC } from "react"

interface SearchInputMessagesProps {
  placeholder?: string
}

export const MessagesSearchInput: FC<SearchInputMessagesProps> = ({
  placeholder
}) => (
  <div>
    <div className="relative rounded-md shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        id="email"
        className="block w-full rounded-md border border-[#2C282D] bg-transparent py-3 pl-10 text-[16px] font-medium leading-[19px] outline-0 ring-0 placeholder:font-medium placeholder:text-[#fff]/30 focus:border-[#2C282D] focus:ring-0"
        placeholder={placeholder}
      />
    </div>
  </div>
)
