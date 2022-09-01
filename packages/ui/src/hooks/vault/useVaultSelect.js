import { useEffect, useState } from "react"
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
function composeDateValue(dateVal) {
  const d = new Date(dateVal * 1000)
  return {
    day: d.getDate(),
    month: MONTHS[d.getMonth()]
  }
}
const INITIAL_DATE = { day: "1", month: "Jan" }

const useVaultSelect = ({ selectedItems, setSelectedItems, itemData }) => {
  const [date, setDate] = useState(INITIAL_DATE)
  const isSelected = selectedItems.includes(itemData)

  const handleSelectItem = () => {
    setSelectedItems([...selectedItems, itemData])
  }
  const handleRemoveItem = () => {
    const itemsArr = selectedItems.slice()
    itemsArr.splice(itemsArr.indexOf(itemData), 1)
    setSelectedItems(itemsArr)
  }
  const onSelectItem = isSelected ? handleRemoveItem : handleSelectItem
  const opacityStyle =
    selectedItems.length > 0 && !isSelected ? "opacity-50" : "opacity-100"

  useEffect(() => {
    if (!itemData.date) return
    const createdAt = composeDateValue(itemData.date)
    setDate(createdAt)
  }, [itemData.date])

  return { date, isSelected, onSelectItem, opacityStyle }
}

export default useVaultSelect
