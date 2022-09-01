import { useState } from "react"

export const SortKeyEnum = {
  RECENT: "Recent",
  MOST_LIKED: "Most Liked",
  HIGHEST_TIP: "Highest Tip"
}
export const SortOrderEnum = {
  ASC: "ASC",
  DESC: "DESC"
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

  const sortKeyOptions = [
    { name: SortKeyEnum.RECENT, onClick: toggleRecent },
    { name: SortKeyEnum.MOST_LIKED, onClick: toggleLiked },
    { name: SortKeyEnum.HIGHEST_TIP, onClick: toggleTips }
  ]
  const sortByOrderOptions = [
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

export function getSortKey(sortBy) {
  switch (sortBy) {
    case SortKeyEnum.RECENT:
      return "date"
    case SortKeyEnum.MOST_LIKED:
      return "totalLikes"
    case SortKeyEnum.HIGHEST_TIP:
      return "totalTips"
    default:
      return "date"
  }
}
export function composeSortKey(activeSort, sortOrder) {
  const sortKey = getSortKey(activeSort)

  return (a, b) => {
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
export function composeMediaFilter(activeFilter, key) {
  return (item) => {
    if (activeFilter === "All") return true
    return item[key].toLowerCase() === activeFilter.toLowerCase()
  }
}

export default useVaultSort
