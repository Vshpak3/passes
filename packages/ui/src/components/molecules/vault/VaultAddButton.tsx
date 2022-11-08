import { ChangeEvent, FC, useRef } from "react"
import { useForm } from "react-hook-form"
import { MdAdd } from "react-icons/md"

import { FileInput } from "src/components/atoms/input/FileInput"
import { ACCEPTED_MEDIA_TYPES } from "src/config/media-limits"

interface VaultAddItemProps {
  onClick: (newFiles: FileList | null) => void
}

interface InputChange {
  files: FileList | null
}

export const VaultAddButton: FC<VaultAddItemProps> = ({ onClick }) => {
  const { register } = useForm()

  const inputRef = useRef<HTMLInputElement>(null)

  const handleSelectContent = () => {
    inputRef.current?.click()
  }

  return (
    <div
      className="cursor-pointer rounded-[50%] bg-[#ffffff40] p-[4px] text-white"
      onClick={handleSelectContent}
    >
      <FileInput
        accept={ACCEPTED_MEDIA_TYPES}
        multiple
        name="file"
        options={{
          onChange: <T extends InputChange>(e: ChangeEvent<T>) => {
            onClick(e.target.files)
          }
        }}
        register={register}
        trigger={<MdAdd size={16} />}
      />
    </div>
  )
}
