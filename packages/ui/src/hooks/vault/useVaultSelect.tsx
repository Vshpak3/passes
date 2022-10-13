import { ContentDto } from "@passes/api-client"
import { Dispatch, SetStateAction } from "react"

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
]

function composeDateValue(dateVal: Date) {
  return {
    day: dateVal.getDate(),
    month: MONTHS[dateVal.getMonth()]
  }
}

interface UseVaultSelectProps {
  selectedItems: Array<string>
  setSelectedItems: Dispatch<SetStateAction<Array<string>>>
  content: ContentDto
}

export const useVaultSelect = ({
  selectedItems = [],
  setSelectedItems,
  content
}: UseVaultSelectProps) => {
  const date = composeDateValue(new Date(content.createdAt))

  const isSelected = selectedItems.includes(content.contentId)

  const handleSelectItem = () => {
    setSelectedItems([...selectedItems, content.contentId])
  }
  const handleRemoveItem = () => {
    const itemsArr = selectedItems.slice()
    itemsArr.splice(itemsArr.indexOf(content.contentId), 1)
    setSelectedItems(itemsArr)
  }
  const onSelectItem = isSelected ? handleRemoveItem : handleSelectItem
  const opacityStyle =
    selectedItems.length > 0 && !isSelected ? "opacity-50" : "opacity-100"

  return { date, isSelected, onSelectItem, opacityStyle }
}
