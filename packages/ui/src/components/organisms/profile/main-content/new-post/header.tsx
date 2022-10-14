import classNames from "classnames"
import ScheduledCalendar from "public/icons/calendar-scheduled-purple-icon.svg"
import Recorder from "public/icons/media-recorder.svg"
import VaultIcon from "public/icons/messages-vault-icon.svg"
import Photos from "public/icons/profile-photos1-icon.svg"
import { FC, useEffect, useState } from "react"
import { FormInput } from "src/components/atoms/FormInput"
import { PostScheduleAlert } from "src/components/atoms/PostScheduleAlert"
import { CalendarPicker } from "src/components/molecules/scheduler/CalendarPicker"
import {
  FormErrors,
  FormOptions,
  FormRegister
} from "src/components/types/FormTypes"

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
    Icon: ScheduledCalendar,
    type: "schedule"
  }
]
type UploadPostMediaProps = {
  messages?: boolean
  register: FormRegister
  activeMediaHeader?: string
  errors: FormErrors
  options?: FormOptions
  onChange: (event: any) => void
  postTime: Date | null
}

export const MediaHeader: FC<UploadPostMediaProps> = ({
  messages,
  register,
  errors,
  options = {},
  onChange,
  activeMediaHeader,
  postTime
}) => {
  const [scheduledPostTime, setScheduledPostTime] = useState<Date | null>(
    postTime
  )

  let _mediaTypes = []
  if (messages) {
    _mediaTypes = messagesMediaTypes
  } else {
    _mediaTypes = mediaTypes
  }

  const handleRemoveScheduledPostTime = () => {
    setScheduledPostTime(null)
  }

  useEffect(() => {
    setScheduledPostTime(postTime)
  }, [postTime])

  return (
    <div className="w-full">
      <div className="relative flex h-full w-full items-center justify-between text-[16px] font-normal">
        <div className="flex items-center">
          <div className="flex w-full flex-wrap justify-between gap-1">
            {_mediaTypes.map(
              ({ name, Icon, accept, type, multiple }, index) => {
                if (type === "schedule") {
                  return (
                    <CalendarPicker key={`${name}-${index}`} onSave={onChange}>
                      <span
                        className={classNames(
                          activeMediaHeader === name
                            ? " bg-[rgba(191,122,240,0.1)] "
                            : "hover:bg-[rgba(191,122,240,0.1)]",
                          "group flex flex-shrink-0 items-center rounded-[56px] py-3 text-sm leading-4 text-passes-secondary-color sm:px-4"
                        )}
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
                      </span>
                    </CalendarPicker>
                  )
                }
                if (type === "button") {
                  return (
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
                  )
                } else {
                  return (
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
                }
              }
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
      {scheduledPostTime && (
        <PostScheduleAlert
          scheduledPostTime={scheduledPostTime}
          onRemoveScheduledPostTime={handleRemoveScheduledPostTime}
        />
      )}
    </div>
  )
}
