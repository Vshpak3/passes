import { Combobox } from "@headlessui/react"
import classNames from "classnames"
import { ChangeEvent, FC, useCallback, useMemo, useState } from "react"

import { SearchBar } from "src/components/molecules/SearchBar"
import { AdminTabProps, AdminTabs, AdminTabsEnum } from "src/config/admin"

interface SettingsSearchBar {
  onSelect: (id: AdminTabsEnum) => void
}

export const SettingsSearchBar: FC<SettingsSearchBar> = ({
  onSelect: _onSelect
}) => {
  const [searchValue, setSearchValue] = useState("")

  const onSelect = (id: AdminTabsEnum) => {
    _onSelect(id)
  }

  const searchOptions = useMemo(
    () =>
      AdminTabs.filter((item) => item.name.includes(searchValue)).map(
        (list: AdminTabProps) => (
          <Combobox.Option key={list.id} value={list.id}>
            {({ active, disabled }) => (
              <span
                className={classNames("block cursor-pointer py-2 px-6", {
                  "bg-[#12070E]/90 text-passes-primary-color": active,
                  "text-gray-500": disabled
                })}
              >
                {list.name}
              </span>
            )}
          </Combobox.Option>
        )
      ),
    [searchValue]
  )

  const onInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setSearchValue(event.target.value),

    []
  )

  return (
    <div className="w-[300px]">
      <SearchBar
        contentName="Settings"
        loading={false}
        onInputChange={onInputChange}
        onSelect={onSelect}
        options={searchOptions}
        searchValue={searchValue}
      />
    </div>
  )
}
