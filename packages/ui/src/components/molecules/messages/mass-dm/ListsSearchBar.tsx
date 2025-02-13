import { Combobox } from "@headlessui/react"
import { ListDto } from "@passes/api-client"
import classNames from "classnames"
import { ChangeEvent, FC, useCallback, useMemo } from "react"

import { SearchBar } from "src/components/molecules/SearchBar"
import { useListsSearch } from "src/hooks/search/useListsSearch"
import { useUser } from "src/hooks/useUser"

interface ListsSearchBarProps {
  selectedListIds: string[]
  onSelect: (list: ListDto) => void
}

export const ListsSearchBar: FC<ListsSearchBarProps> = ({
  selectedListIds,
  onSelect: _onSelect
}) => {
  const { user } = useUser()

  const { results, setSearchValue, loading, searchValue } = useListsSearch(
    user?.userId
  )

  const onSelect = (list: ListDto) => {
    _onSelect(list)
    setSearchValue("")
  }

  const searchOptions = useMemo(
    () =>
      results.map((list) => (
        <Combobox.Option
          disabled={selectedListIds.includes(list.listId)}
          key={list.listId}
          value={list}
        >
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
      )),
    [selectedListIds, results]
  )

  const onInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setSearchValue(event.target.value),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <SearchBar
      contentName="lists"
      loading={loading}
      onInputChange={onInputChange}
      onSelect={onSelect}
      options={searchOptions}
      searchValue={searchValue}
    />
  )
}
