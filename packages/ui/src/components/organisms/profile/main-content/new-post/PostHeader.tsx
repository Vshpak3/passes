import CloseIcon from "public/icons/sidebar-close-icon.svg"
import { FormInput } from "src/components/atoms"
import {
  FormErrors,
  FormOptions,
  FormRegister
} from "src/components/types/FormTypes"

interface IPostHeader {
  onClose: () => void
  messages?: boolean
  register: FormRegister
  errors: FormErrors
  options?: FormOptions
}

const PostHeader: React.FC<IPostHeader> = ({
  onClose,
  messages,
  register,
  errors,
  options = {}
}) => {
  return (
    <div className="relative flex h-full w-full items-center justify-between border-b border-[#2B282D] pb-4 text-[16px] font-normal">
      <div className="flex items-center space-x-4">
        <button onClick={onClose} type="button">
          <CloseIcon />
        </button>
        <h4 className="text-xl font-bold leading-4">New Post</h4>
      </div>

      {!messages && (
        <FormInput
          label="Paid"
          type="toggle"
          register={register}
          errors={errors}
          options={options}
          name="isPaid"
          className="group"
        />
      )}
    </div>
  )
}

export default PostHeader
