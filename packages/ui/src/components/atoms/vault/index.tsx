import classNames from "classnames"
import ExitIcon from "public/icons/exit-icon.svg"
import AddToIcon from "public/icons/plus-square.svg"
import { ChangeEvent, Dispatch, FC, SetStateAction, useRef } from "react"
import { useForm } from "react-hook-form"
import { MdAdd, MdDelete } from "react-icons/md"
import { FormInput } from "src/components/atoms/FormInput"
import { ACCEPTED_MEDIA_TYPES } from "src/config/media_limits"
import { ContentFile } from "src/hooks/useMedia"

const filterStyles = {
  button: "rounded-[56px] bg-[#FFFEFF]/10 hover:bg-[#EDEDED]",
  activeButton: "rounded-[56px] bg-[#EDEDED]",
  label: "text-white group-hover:text-[#000000]",
  activeLabel: "text-[#000000]"
}

interface VaultDeselectButtonProps {
  isVisible: boolean
  deselectAll: () => void
}

interface VaultSelectLabelProps {
  selectedItemsLength: number
}

interface VaultFilterOptionProps {
  buttonStyle: string
  isActive: boolean
  label: string
  onClick: () => void
}

interface VaultAddToItemProps {
  label: string
  onClick: () => void
}

interface VaultDeleteButtonProps {
  toggleDeleteModal: () => void
}
interface VaultAddItemProps {
  onClick: Dispatch<SetStateAction<ContentFile[]>>
}

interface InputChange {
  files: File[] | FileList | null
}

export const VaultDeselectButton: FC<VaultDeselectButtonProps> = ({
  isVisible,
  deselectAll
}) => (
  <div
    className="h-[18px] w-[18px] cursor-pointer items-center justify-center text-[#000000]"
    onClick={deselectAll}
  >
    {isVisible && <ExitIcon />}
  </div>
)

export const VaultFilterOption: FC<VaultFilterOptionProps> = ({
  buttonStyle,
  isActive,
  label,
  onClick
}) => {
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

export const VaultSelectLabel: FC<VaultSelectLabelProps> = ({
  selectedItemsLength
}) => (
  <div className="align-items flex">
    <div className="text-md font-semibold text-white">
      {selectedItemsLength > 0 &&
        `${selectedItemsLength} ${
          selectedItemsLength === 1 ? "item" : "items"
        } selected`}
    </div>
  </div>
)

export const VaultAddToItem: FC<VaultAddToItemProps> = ({ label, onClick }) => (
  <div
    onClick={onClick}
    className="align-items flex w-full cursor-pointer items-center rounded p-2 text-base text-[#FFFF] ring-0 hover:bg-[#9C4DC1] focus:shadow-none focus:ring-0 focus:ring-offset-0"
  >
    <AddToIcon />
    <div className="ml-3">{label}</div>
  </div>
)

export const VaultDeleteButton: FC<VaultDeleteButtonProps> = ({
  toggleDeleteModal
}) => {
  return (
    <div
      onClick={toggleDeleteModal}
      className="cursor-pointer px-2 text-white opacity-70 hover:opacity-100 md:px-3"
    >
      <MdDelete size={23} />
    </div>
  )
}

export const VaultAddButton: FC<VaultAddItemProps> = ({ onClick }) => {
  const { register } = useForm()
  const inputRef = useRef<HTMLInputElement>(null)
  const handleSelectContent = () => {
    inputRef.current?.click()
  }

  return (
    <div
      onClick={handleSelectContent}
      className="cursor-pointer rounded-[50%] bg-[#ffffff40] p-[4px] text-white"
    >
      <FormInput
        register={register}
        name="file"
        type="file"
        multiple={true}
        trigger={<MdAdd size={16} />}
        options={{
          onChange: <T extends InputChange>(e: ChangeEvent<T>) => {
            e.target.files && onClick([{ file: e.target.files[0] }])
          }
        }}
        accept={ACCEPTED_MEDIA_TYPES}
        className="hidden"
      />
    </div>
  )
}
