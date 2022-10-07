import classNames from "classnames"
import ExitIcon from "public/icons/exit-icon.svg"
import AddToIcon from "public/icons/plus-square.svg"
import { FC } from "react"
import { MdDelete } from "react-icons/md"

const filterStyles = {
  button: "rounded-[56px] bg-[#FFFEFF]/10 hover:bg-[#EDEDED]",
  activeButton: "rounded-[56px] bg-[#EDEDED]",
  label: "text-white group-hover:text-[#000000]",
  activeLabel: "text-[#000000]"
}

interface IVaultDeselectButton {
  isVisible: boolean
  deselectAll: () => void
}
interface IVaultItemDate {
  date: string
}
interface IVaultSelectLabel {
  selectedItemsLength: number
}
interface IVaultFilterOption {
  buttonStyle: string
  isActive: boolean
  label: string
  onClick: () => void
}
interface IVaultAddToItem {
  label: string
  onClick: () => void
}
interface IVaultDeleteButton {
  toggleDeleteModal: () => void
}
interface IVaultSortItem {
  label?: string
  onClick?: () => void
  sortedItem: string
  name: string
}

const VaultDeselectButton = ({
  isVisible,
  deselectAll
}: IVaultDeselectButton) => (
  <div
    className="h-[18px] w-[18px] cursor-pointer items-center justify-center text-[#000000]"
    onClick={deselectAll}
  >
    {isVisible && <ExitIcon />}
  </div>
)

const VaultItemDate = ({ date }: IVaultItemDate) => (
  <div className="mr-auto h-[23px] w-[50px] rounded-md bg-transparent md:bg-[#00000030] ">
    <div className="hidden text-center text-[11px] font-semibold text-[#ffffff] md:block">
      {date}
    </div>
  </div>
)

const VaultFilterOption = ({
  buttonStyle,
  isActive,
  label,
  onClick
}: IVaultFilterOption) => {
  const buttonClass = classNames(
    isActive ? filterStyles.activeButton : filterStyles.button,
    `group mr-1 flex h-[32px] min-w-[65px] cursor-pointer place-items-start items-center justify-center ${buttonStyle}`
  )
  const labelClass = classNames(
    isActive ? filterStyles.activeLabel : filterStyles.label,
    "group cursor-pointer items-center text-center text-xs font-semibold text-white"
  )
  return (
    <span onClick={onClick} className={buttonClass}>
      <div className={labelClass}>{label}</div>
    </span>
  )
}

const VaultSelectLabel = ({ selectedItemsLength }: IVaultSelectLabel) => (
  <div className="align-items flex">
    <div className="text-md font-semibold text-white">
      {selectedItemsLength > 0 &&
        `${selectedItemsLength} ${
          selectedItemsLength === 1 ? "item" : "items"
        } selected`}
    </div>
  </div>
)

const VaultAddToItem = ({ label, onClick }: IVaultAddToItem) => (
  <div
    onClick={onClick}
    className="align-items flex w-full cursor-pointer items-center rounded p-2 text-base text-[#FFFF] ring-0 hover:bg-[#9C4DC1] focus:shadow-none focus:ring-0 focus:ring-offset-0"
  >
    <AddToIcon />
    <div className="ml-3">{label}</div>
  </div>
)

const VaultSortItem = ({
  sortedItem,
  onClick,
  name,
  label
}: IVaultSortItem) => (
  <div
    onClick={onClick}
    className={classNames(
      sortedItem === name ? "bg-[#9C4DC1]" : "bg-transparent",
      "flex w-full cursor-pointer rounded p-1 text-base text-[#FFFF] ring-0 focus:shadow-none focus:ring-0 focus:ring-offset-0"
    )}
  >
    {label}
  </div>
)

const VaultDeleteButton: FC<IVaultDeleteButton> = ({ toggleDeleteModal }) => {
  return (
    <div
      onClick={toggleDeleteModal}
      className="cursor-pointer px-2 text-white opacity-70 hover:opacity-100 md:px-3"
    >
      <MdDelete size={23} />
    </div>
  )
}

export {
  VaultAddToItem,
  VaultDeleteButton,
  VaultDeselectButton,
  VaultFilterOption,
  VaultItemDate,
  VaultSelectLabel,
  VaultSortItem
}
