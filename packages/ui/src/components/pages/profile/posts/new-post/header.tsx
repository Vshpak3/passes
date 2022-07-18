import Microphone from "public/icons/media-microphone.svg"
import Photos from "public/icons/media-photos.svg"
import Recorder from "public/icons/media-recorder.svg"

import { FormInput } from "../../../../form/form-input"
import { FormErrors, FormOptions, FormRegister } from "../../../../form/types"

const mediaTypes = [
  {
    name: "Photos",
    Icon: Photos,
    type: "image",
    multiple: true
  },
  {
    name: "Video",
    Icon: Recorder,
    type: "video"
  },
  {
    name: "Audio",
    Icon: Microphone,
    type: "audio"
  }
]
type UploadPostMediaProps = {
  register: FormRegister
  errors: FormErrors
  options?: FormOptions
  onChange: (event: any) => void
}

const MediaHeader = ({
  register,
  errors,
  options = {},
  onChange
}: UploadPostMediaProps) => (
  <div className="relative flex h-full w-full items-center justify-between pb-4 text-[16px] font-normal">
    <div className="flex items-center gap-4">
      <span className="mr-2">Type</span>
      {mediaTypes.map(({ name, Icon, type, multiple }) => (
        <FormInput
          trigger={
            <span className="flex cursor-pointer gap-1">
              <Icon className="h-6 w-6" />
              <span className="hidden group-hover:block">{name}</span>
            </span>
          }
          type="file"
          register={register}
          errors={errors}
          options={{ ...options, onChange }}
          key={`media-header-${name}`}
          name={`media-header-${name}`}
          accept={[type as any]}
          multiple={multiple}
          className="group rounded-[56px] p-2 text-sm hover:bg-[rgba(191,122,240,0.1)] hover:px-4"
        />
      ))}
    </div>
    <FormInput
      label="Paid"
      type="toggle"
      register={register}
      errors={errors}
      options={options}
      name="isPaid"
      className="group rounded-[56px] p-2 text-sm hover:bg-[rgba(191,122,240,0.1)] hover:px-4"
    />
  </div>
)

export default MediaHeader
