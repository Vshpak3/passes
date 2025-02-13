import CloseIcon from "public/icons/sidebar/close.svg"
import { FC } from "react"

import { Checkbox } from "src/components/atoms/input/Checkbox"
import { FormRegister } from "src/components/atoms/input/InputTypes"

interface NewPostEditorHeaderProps {
  title: string
  formName: string
  onClose: () => void
  register: FormRegister
}

export const NewPostEditorHeader: FC<NewPostEditorHeaderProps> = ({
  title,
  formName,
  onClose,
  register
}) => {
  return (
    <div className="relative flex h-full w-full items-center justify-between border-b border-[#2B282D] pb-4 text-[16px] font-normal">
      <div className="flex items-center space-x-4">
        <button onClick={onClose} type="button">
          <CloseIcon />
        </button>
        <h4 className="text-xl font-bold leading-4">{title}</h4>
      </div>

      <Checkbox
        className="group"
        label="Paid"
        name={formName}
        register={register}
        type="toggle"
      />
    </div>
  )
}
