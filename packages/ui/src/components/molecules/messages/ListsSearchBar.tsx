import { Combobox } from "@headlessui/react"
import { ListDto } from "@passes/api-client"
import classNames from "classnames"
import { FC, useCallback, useMemo } from "react"

import { SearchBar } from "src/components/molecules/SearchBar"
import { useListsSearch } from "src/hooks/search/useListsSearch"
import { useUser } from "src/hooks/useUser"

interface ListsSearchBarProps {
  selectedListIds: string[]
  onSelect: (list: ListDto) => void
}

export const ListsSearchBar: FC<ListsSearchBarProps> = ({
  selectedListIds,
  onSelect
}) => {
  const { user } = useUser()

  const { results, setSearchValue, loading, searchValue } = useListsSearch(
    user?.userId
  )

  const searchOptions = useMemo(
    () =>
      results.map((list) => (
        <Combobox.Option
          key={list.listId}
          value={list}
          disabled={selectedListIds.includes(list.listId)}
        >
          {({ active, disabled }) => (
            <span
              className={classNames("block cursor-pointer py-2 px-6", {
                "bg-[#1b141d]/90 text-passes-primary-color": active,
                "text-gray-500": disabled
              })}
            >
              {list.name}
            </span>
          )}
        </Combobox.Option>
      )),
    [selectedListIds, results]
  )

  const onInputChange = useCallback(
    (event: any) => setSearchValue(event.target.value),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <SearchBar
      options={searchOptions}
      loading={loading}
      searchValue={searchValue}
      emptyText="lists"
      placeholder="Find lists"
      onInputChange={onInputChange}
      onSelect={onSelect}
    />
  )
}
