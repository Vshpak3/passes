import Quiz from "public/icons/media-quiz.svg"
import Recorder from "public/icons/media-recorder.svg"
import VaultIcon from "public/icons/messages-vault-icon.svg"
import PaidIcon from "public/icons/paid-content-icon.svg"
import Calendar from "public/icons/profile-calendar-icon.svg"
import Photos from "public/icons/profile-photos1-icon.svg"
import { FormInput } from "src/components/atoms"
import { FormErrors, FormOptions, FormRegister } from "src/components/FormTypes"
import { classNames } from "src/helpers"

const messagesMediaTypes = [
  {
    name: "Photo",
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
    name: "Vault",
    Icon: VaultIcon,
    accept: [".mp4", ".mov", ".qt"],
    type: "button"
  },
  {
    name: "Message Price",
    Icon: PaidIcon,
    accept: [".mp4", ".mov", ".qt"],
    type: "button"
  }
]

const mediaTypes = [
  {
    name: "Photo",
    Icon: Photos,
    accept: [".png", ".jpg", ".jpeg", ".mp4", ".mov", ".qt", ".mp3"],
    multiple: true,
    type: "button"
  },
  {
    name: "Video",
    Icon: Recorder,
    accept: [".mp4", ".mov", ".qt"],
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
  messages?: boolean
  register: FormRegister
  activeMediaHeader?: string
  errors: FormErrors
  options?: FormOptions
  onChange: (event: any) => void
}

const MediaHeader = ({
  messages,
  register,
  errors,
  options = {},
  onChange,
  activeMediaHeader
}: UploadPostMediaProps) => {
  let _mediaTypes = []
  if (messages) {
    _mediaTypes = messagesMediaTypes
  } else _mediaTypes = mediaTypes
  return (
    <div className="relative flex h-full w-full items-center justify-between pb-4 text-[16px] font-normal">
      <div className="flex items-center ">
        {/* <span className="mr-2">Type</span> */}
        <div className="flex w-full flex-wrap justify-between gap-1">
          {_mediaTypes.map(({ name, Icon, accept, type, multiple }) =>
            type === "button" ? (
              <button
                type={type}
                className={classNames(
                  activeMediaHeader === name
                    ? " bg-[rgba(191,122,240,0.1)] "
                    : "hover:bg-[rgba(191,122,240,0.1)]",
                  "group flex flex-shrink-0 items-center rounded-[56px] px-4 py-3 text-sm leading-4 text-[#BF7AF0]"
                )}
                onClick={() => onChange(name)}
              >
                <span className="flex flex-shrink-0 cursor-pointer items-center gap-1">
                  <Icon className="flex flex-shrink-0" />
                  <span
                    className={classNames(
                      activeMediaHeader === name
                        ? "block"
                        : "hidden group-hover:block",
                      "block"
                    )}
                  >
                    {name}
                  </span>
                </span>
              </button>
            ) : (
              <FormInput
                trigger={
                  <button
                    // type={type}
                    className={classNames(
                      activeMediaHeader === name
                        ? " bg-[rgba(191,122,240,0.1)] "
                        : "hover:bg-[rgba(191,122,240,0.1)]",
                      "group flex flex-shrink-0 items-center rounded-[56px] px-4 py-3 text-sm leading-4 text-[#BF7AF0]"
                    )}
                    // onClick={() => onChange(name)}
                  >
                    <span className="flex flex-shrink-0 cursor-pointer items-center gap-1">
                      <Icon className="flex flex-shrink-0" />
                      <span
                        className={classNames(
                          activeMediaHeader === name
                            ? "block"
                            : "hidden group-hover:block",
                          "block"
                        )}
                      >
                        {name}
                      </span>
                    </span>
                  </button>
                }
                type={type as any}
                register={register}
                errors={errors}
                options={{ ...options, onChange }}
                key={`media-header-${name}`}
                name={`media-header-${name}`}
                accept={accept as any}
                multiple={multiple}
                className={classNames(
                  activeMediaHeader === name
                    ? " bg-[rgba(191,122,240,0.1)] "
                    : "hover:bg-[rgba(191,122,240,0.1)]",
                  "group flex flex-shrink-0 items-center rounded-[56px] px-4 py-3 text-sm leading-4 text-[#BF7AF0]"
                )}
              />
            )
          )}
        </div>
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

export default MediaHeader
