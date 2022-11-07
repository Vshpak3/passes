import { ChangeEvent, Dispatch, FC, SetStateAction, useRef } from "react"
import { useForm } from "react-hook-form"
import { MdAdd } from "react-icons/md"

import { FileInput } from "src/components/atoms/input/FileInput"
import { ACCEPTED_MEDIA_TYPES } from "src/config/media-limits"
import { ContentFile } from "src/hooks/useMedia"

interface VaultAddItemProps {
  onClick: Dispatch<SetStateAction<ContentFile[]>>
}

interface InputChange {
  files: File[] | FileList | null
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
        className="hidden"
        multiple
        name="file"
        options={{
          onChange: <T extends InputChange>(e: ChangeEvent<T>) => {
            e.target.files && onClick([{ file: e.target.files[0] }])
          }
        }}
        register={register}
        trigger={<MdAdd size={16} />}
      />
    </div>
  )
}
