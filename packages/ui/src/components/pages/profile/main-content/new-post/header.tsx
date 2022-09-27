import dynamic from "next/dynamic"
import Recorder from "public/icons/media-recorder.svg"
import VaultIcon from "public/icons/messages-vault-icon.svg"
import PaidIcon from "public/icons/paid-content-icon.svg"
import Photos from "public/icons/profile-photos1-icon.svg"
import { useContext } from "react"
import { FormInput } from "src/components/atoms"
import {
  FormErrors,
  FormOptions,
  FormRegister
} from "src/components/types/FormTypes"
import { classNames } from "src/helpers"

import { MainContext } from "../../../../../context/MainContext"
import { PostScheduleAlert } from "../../../../atoms/PostScheduleAlert"

const DateAndTimePicker = dynamic<never>(() =>
  import("src/components/atoms/DateAndTimePicker").then(
    (md) => md.DateAndTimePicker
  )
)

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
    name: "Media",
    Icon: Photos,
    accept: [".png", ".jpg", ".jpeg", ".mp4", ".mov", ".qt", ".mp3"],
    multiple: true,
    type: "button"
  },
  {
    name: "Schedule",
    Icon: DateAndTimePicker,
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
  const { postTime } = useContext(MainContext)
  let _mediaTypes = []
  if (messages) {
    _mediaTypes = messagesMediaTypes
  } else _mediaTypes = mediaTypes
  return (
    <div className="w-full pb-3">
      <div className="relative flex h-full w-full items-center justify-between text-[16px] font-normal">
        <div className="flex items-center">
          <div className="flex w-full flex-wrap justify-between gap-1">
            {_mediaTypes.map(({ name, Icon, accept, type, multiple }, index) =>
              type === "button" ? (
                <button
                  key={`${name}-${index}`}
                  type={type}
                  className={classNames(
                    activeMediaHeader === name
                      ? " bg-[rgba(191,122,240,0.1)] "
                      : "hover:bg-[rgba(191,122,240,0.1)]",
                    "group flex flex-shrink-0 items-center rounded-[56px] py-3 text-sm leading-4 text-passes-secondary-color sm:px-4"
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
                      type="button"
                      className={classNames(
                        activeMediaHeader === name
                          ? " bg-[rgba(191,122,240,0.1)] "
                          : "hover:bg-[rgba(191,122,240,0.1)]",
                        "group flex flex-shrink-0 items-center rounded-[56px] px-4 py-3 text-sm leading-4 text-passes-secondary-color"
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
                    "group flex flex-shrink-0 items-center rounded-[56px] px-4 py-3 text-sm leading-4 text-passes-secondary-color"
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
      {postTime && <PostScheduleAlert />}
    </div>
  )
}

export default MediaHeader
