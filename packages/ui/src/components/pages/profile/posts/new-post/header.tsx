import BarChart from "public/icons/media-bar-chart.svg"
import Fundraising from "public/icons/media-fundraising.svg"
import Microphone from "public/icons/media-microphone.svg"
import Quiz from "public/icons/media-quiz.svg"
import Recorder from "public/icons/media-recorder.svg"
import Calendar from "public/icons/profile-calendar-icon.svg"
import Photos from "public/icons/profile-photos1-icon.svg"

import { FormInput } from "../../../../form/form-input"
import { FormErrors, FormOptions, FormRegister } from "../../../../form/types"

const mediaTypes = [
  {
    name: "Photos",
    Icon: Photos,
    accept: [".png", ".jpg", ".jpeg"],
    multiple: true,
    type: "file"
  },
  {
    name: "Video",
    Icon: Recorder,
    accept: [".mp4", ".mov", ".qt"],
    type: "file"
  },
  {
    name: "Audio",
    Icon: Microphone,
    accept: ["audio"],
    type: "file"
  },
  {
    name: "Polls",
    Icon: BarChart,
    type: "button"
  },
  {
    name: "Fundraiser",
    Icon: Fundraising,
    type: "button"
  },
  {
    name: "Quiz",
    Icon: Quiz,
    type: "button"
  },
  {
    name: "Schedule",
    Icon: Calendar,
    type: "button"
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
    <div className="flex items-center">
      <span className="mr-2">Type</span>
      <div className="flex w-full justify-between ">
        {mediaTypes.map(({ name, Icon, accept, type, multiple }) =>
          type === "button" ? (
            <button
              type={type}
              className="group flex flex-shrink-0 rounded-[56px] px-4 py-3 text-sm leading-4 text-[#BF7AF0] hover:bg-[rgba(191,122,240,0.1)] "
              onClick={() => onChange(name)}
            >
              <span className="flex flex-shrink-0 cursor-pointer items-center gap-1">
                <Icon className="flex flex-shrink-0" />
                <span className="hidden group-hover:block">{name}</span>
              </span>
            </button>
          ) : (
            <FormInput
              trigger={
                <span className="flex flex-shrink-0 cursor-pointer items-center gap-1">
                  <Icon className="flex flex-shrink-0" />
                  <span className="hidden group-hover:block">{name}</span>
                </span>
              }
              type={type as any}
              register={register}
              errors={errors}
              options={{ ...options, onChange }}
              key={`media-header-${name}`}
              name={`media-header-${name}`}
              accept={accept as any}
              multiple={multiple}
              className="group flex flex-shrink-0 rounded-[56px] px-4 py-3 text-sm leading-4 text-[#BF7AF0] hover:bg-[rgba(191,122,240,0.1)] "
            />
          )
        )}
      </div>
    </div>
    <FormInput
      label="Paid"
      type="toggle"
      register={register}
      errors={errors}
      options={options}
      name="isPaid"
      className="group rounded-[56px] p-2 text-sm hover:bg-[rgba(191,122,240,0.1)]"
    />
  </div>
)

export default MediaHeader
