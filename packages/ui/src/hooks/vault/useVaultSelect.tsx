import { ContentDto } from "@passes/api-client"
import { Dispatch, SetStateAction, useState } from "react"

// TODO: use this once date is available in API
// const MONTHS = [
//   "Jan",
//   "Feb",
//   "Mar",
//   "Apr",
//   "May",
//   "Jun",
//   "Jul",
//   "Aug",
//   "Sep",
//   "Oct",
//   "Nov",
//   "Dec"
// ]
// function composeDateValue(dateVal: number) {
//   const d = new Date(dateVal * 1000)
//   return {
//     day: d.getDate(),
//     month: MONTHS[d.getMonth()]
//   }
// }
const INITIAL_DATE = { day: "1", month: "Jan" }

interface IUseVaultSelect {
  selectedItems: Array<string>
  setSelectedItems: Dispatch<SetStateAction<Array<string>>>
  itemData: ContentDto
}

const useVaultSelect = ({
  selectedItems = [],
  setSelectedItems,
  itemData
}: IUseVaultSelect) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [date, setDate] = useState(INITIAL_DATE)

  const isSelected = selectedItems.includes(itemData.contentId)

  const handleSelectItem = () => {
    setSelectedItems([...selectedItems, itemData.contentId])
  }
  const handleRemoveItem = () => {
    const itemsArr = selectedItems.slice()
    itemsArr.splice(itemsArr.indexOf(itemData.contentId), 1)
    setSelectedItems(itemsArr)
  }
  const onSelectItem = isSelected ? handleRemoveItem : handleSelectItem
  const opacityStyle =
    selectedItems.length > 0 && !isSelected ? "opacity-50" : "opacity-100"

  // TODO: use this once date is available in API
  // useEffect(() => {
  // if (!itemData.date) return setDate(INITIAL_DATE)
  // const createdAt = composeDateValue(itemData.date)
  // setDate(createdAt)
  // }, [itemData.date])

  return { date, isSelected, onSelectItem, opacityStyle }
}

export default useVaultSelect
