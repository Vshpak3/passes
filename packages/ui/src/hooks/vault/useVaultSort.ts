import { ContentDto } from "@passes/api-client"
import { useState } from "react"

export enum SortKeyEnum {
  RECENT = "Recent",
  MOST_LIKED = "Most Liked",
  HIGHEST_TIP = "Highest Tip"
}
export enum SortOrderEnum {
  ASC = "ASC",
  DESC = "DESC"
}

export interface ISortOption {
  name: SortKeyEnum | SortOrderEnum
  label?: string
  onClick: () => void
}

const useVaultSort = () => {
  const [deleteModalActive, setDeleteModalActive] = useState(false)

  const [sortKey, setSortKey] = useState(SortKeyEnum.RECENT)
  const [sortOrder, setSortOrder] = useState(SortOrderEnum.ASC)

  const toggleDeleteModal = () => setDeleteModalActive(!deleteModalActive)

  const toggleRecent = () => setSortKey(SortKeyEnum.RECENT)
  const toggleLiked = () => setSortKey(SortKeyEnum.MOST_LIKED)
  const toggleTips = () => setSortKey(SortKeyEnum.HIGHEST_TIP)

  const toggleAsc = () => setSortOrder(SortOrderEnum.ASC)
  const toggleDesc = () => setSortOrder(SortOrderEnum.DESC)

  const sortKeyOptions: ISortOption[] = [
    { name: SortKeyEnum.RECENT, onClick: toggleRecent },
    { name: SortKeyEnum.MOST_LIKED, onClick: toggleLiked },
    { name: SortKeyEnum.HIGHEST_TIP, onClick: toggleTips }
  ]
  const sortByOrderOptions: ISortOption[] = [
    { name: SortOrderEnum.ASC, label: "Ascending", onClick: toggleAsc },
    { name: SortOrderEnum.DESC, label: "Descending", onClick: toggleDesc }
  ]

  return {
    deleteModalActive,
    setDeleteModalActive,
    sortByOrderOptions,
    sortKey,
    sortKeyOptions,
    toggleDeleteModal,
    sortOrder
  }
}

export function getSortKey(sortBy: SortKeyEnum) {
  switch (sortBy) {
    case SortKeyEnum.RECENT:
      // return "date"
      return "id"
    case SortKeyEnum.MOST_LIKED:
      //   return "totalLikes"
      return "userId"
    // case SortKeyEnum.HIGHEST_TIP:
    //   return "totalTips"
    default:
      return "contentType"
  }
}
export function composeSortKey(
  activeSort: SortKeyEnum,
  sortOrder: SortOrderEnum
) {
  const sortKey = getSortKey(activeSort)

  return (a: ContentDto, b: ContentDto) => {
    const isAsc = sortOrder === SortOrderEnum.ASC
    if (a[sortKey] > b[sortKey]) {
      return isAsc ? -1 : 1
    }
    if (a[sortKey] < b[sortKey]) {
      return isAsc ? 1 : -1
    }
    return 0
  }
}

export default useVaultSort
