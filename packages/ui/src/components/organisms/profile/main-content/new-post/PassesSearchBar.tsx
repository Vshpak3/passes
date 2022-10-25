import { Combobox } from "@headlessui/react"
import { PassDto } from "@passes/api-client"
import classNames from "classnames"
import { FC, useCallback, useMemo } from "react"

import { SearchBar } from "src/components/molecules/SearchBar"
import { useProfile } from "src/hooks/profile/useProfile"
import { usePassesSearch } from "src/hooks/search/usePassesSearch"

interface PassesSearchBarProps {
  selectedPassIds: string[]
  onSelect: (pass: PassDto) => void
  userId?: string
}

export const PassesSearchBar: FC<PassesSearchBarProps> = ({
  selectedPassIds,
  onSelect,
  userId
}) => {
  const { profileUserId } = useProfile()

  const { results, setSearchValue, searchValue } = usePassesSearch(
    userId ? userId : profileUserId
  )

  const searchOptions = useMemo(
    () =>
      results.map((pass) => (
        <Combobox.Option
          key={pass.passId}
          value={pass}
          disabled={selectedPassIds.includes(pass.passId)}
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
    (event: any) => setSearchValue(event.target.value),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <SearchBar
      options={searchOptions}
      searchValue={searchValue}
      emptyText="passes"
      placeholder="Find passes"
      onInputChange={onInputChange}
      onSelect={onSelect}
    />
  )
}
