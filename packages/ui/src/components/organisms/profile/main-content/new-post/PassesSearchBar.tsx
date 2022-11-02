import { Combobox } from "@headlessui/react"
import { PassDto } from "@passes/api-client"
import classNames from "classnames"
import { ChangeEvent, FC, useCallback, useMemo } from "react"

import { SearchBar } from "src/components/molecules/SearchBar"
import { usePassesSearch } from "src/hooks/search/usePassesSearch"
import { useUser } from "src/hooks/useUser"

interface PassesSearchBarProps {
  selectedPassIds: string[]
  onSelect: (pass: PassDto) => void
}

export const PassesSearchBar: FC<PassesSearchBarProps> = ({
  selectedPassIds,
  onSelect
}) => {
  const { user } = useUser()

  const { results, setSearchValue, searchValue, loading } = usePassesSearch(
    user?.userId
  )

  const searchOptions = useMemo(
    () =>
      results.map((pass) => (
        <Combobox.Option
          disabled={selectedPassIds.includes(pass.passId)}
          key={pass.passId}
          value={pass}
        >
          {({ active, disabled }) => (
            <span
              className={classNames("block cursor-pointer py-2 px-6", {
                "bg-[#1b141d]/90 text-passes-primary-color": active,
                "text-gray-500": disabled
              })}
            >
              {pass.title}
            </span>
          )}
        </Combobox.Option>
      )),
    [selectedPassIds, results]
  )

  const onInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setSearchValue(event.target.value),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <SearchBar
      contentName="memberships"
      loading={loading}
      onInputChange={onInputChange}
      onSelect={onSelect}
      options={searchOptions}
      searchValue={searchValue}
    />
  )
}
