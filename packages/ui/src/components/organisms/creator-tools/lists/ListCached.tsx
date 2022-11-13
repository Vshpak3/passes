import { ListDto } from "@passes/api-client"
import { FC, useEffect } from "react"

import { useList } from "src/hooks/entities/useList"
import { List } from "./List"

export interface ListCachedProps {
  list: ListDto
  removable?: boolean
}

export const ListCached: FC<ListCachedProps> = ({
  list,
  ...res
}: ListCachedProps) => {
  const { list: cachedList, update } = useList(list.listId)
  useEffect(() => {
    if (!cachedList) {
      update(list)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cachedList])

  return <List list={cachedList ?? list} {...res} update={update} />
}
