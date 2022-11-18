import { Combobox } from "@headlessui/react"
import SearchIcon from "public/icons/messages-search-icon.svg"
import React, { FC } from "react"

interface SettingsSearchBar {
  value: string
  setValue: React.Dispatch<string>
}

export const SettingsSearchBar: FC<SettingsSearchBar> = ({
  value,
  setValue
}: SettingsSearchBar) => {
  return (
    <div className="mb-2 flex h-[73px] w-full items-center border-b border-passes-dark-200 px-4">
      <Combobox<string> onChange={setValue} value={value as string}>
        <div className="relative flex w-full flex-col">
          <Combobox.Button as="div">
            <div className="relative flex items-center gap-3">
              <SearchIcon
                className="pointer-events-none absolute top-1/2 left-[14px] z-10 -translate-y-1/2"
                height="20"
                width="20"
              />
              <Combobox.Input
                autoComplete="off"
                className="form-input h-[51px] w-full rounded-md border-0 bg-[#12070E]/50 pl-11 text-white outline-none placeholder:text-[16px] placeholder:text-white/30 focus:border focus:border-passes-pink-100/80 focus:outline-none focus:ring-passes-pink-100/80"
                id="search"
                name="search"
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search Settings"
                type="search"
                value={value}
              />
            </div>
          </Combobox.Button>
        </div>
      </Combobox>
    </div>
  )
}
