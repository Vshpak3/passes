import classNames from "classnames"
import Recorder from "public/icons/media-recorder.svg"
import Photos from "public/icons/profile-photos1-icon.svg"
import { ChangeEvent, FC, PropsWithChildren } from "react"

import { FileAccept, FileInput } from "src/components/atoms/input/FileInput"
import {
  FormErrors,
  FormOptions,
  FormRegister
} from "src/components/atoms/input/InputTypes"

export const PhotoSelector = {
  name: "Photo",
  Icon: Photos,
  accept: [".png", ".jpg", ".jpeg"] as FileAccept,
  multiple: true
}
export const VideoSelector = {
  name: "Video",
  Icon: Recorder,
  accept: [".mp4", ".mov", ".qt"] as FileAccept,
  multiple: true
}

interface FileSelectorProps {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: any
  accept: FileAccept
  multiple: boolean
}

type MediaSelectorProps = {
  register: FormRegister
  activeMediaHeader?: string
  errors: FormErrors
  options?: FormOptions
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  selectors: FileSelectorProps[]
}

export const MediaSelector: FC<PropsWithChildren<MediaSelectorProps>> = ({
  register,
  errors,
  options = {},
  onChange,
  activeMediaHeader,
  selectors,
  children
}) => {
  return (
    <div>
      <div className="relative flex h-full w-full items-center justify-between text-[16px] font-normal">
        <div className="flex items-center">
          <div className="flex w-full flex-wrap justify-between gap-1">
            {selectors.map(({ name, Icon, accept, multiple }) => {
              return (
                <FileInput
                  accept={accept}
                  errors={errors}
                  key={`media-header-${name}`}
                  multiple={multiple}
                  name={`media-header-${name}`}
                  options={{ ...options, onChange }}
                  register={register}
                  trigger={
                    <button
                      className={classNames(
                        activeMediaHeader === name
                          ? " bg-[#FF51A8]/10 "
                          : "hover:bg-[#FF51A8]/10",
                        "group flex flex-shrink-0 items-center rounded-[56px] px-4 py-3 text-sm leading-4 text-[#FF51A8]"
                      )}
                      type="button"
                    >
                      <span className="flex shrink-0 cursor-pointer items-center gap-1">
                        <Icon className="flex shrink-0" />
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
                  // onBlur={() => setActiveMediaHeader("")}
                  // there's no way to detect closing event
                />
              )
            })}
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
