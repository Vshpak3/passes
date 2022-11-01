import classNames from "classnames"
import Recorder from "public/icons/media-recorder.svg"
import Photos from "public/icons/profile-photos1-icon.svg"
import { FC, PropsWithChildren } from "react"

import { FormInput } from "src/components/atoms/FormInput"
import {
  FormErrors,
  FormOptions,
  FormRegister
} from "src/components/types/FormTypes"

export const PhotoSelector = {
  name: "Photo",
  Icon: Photos,
  accept: [".png", ".jpg", ".jpeg"],
  multiple: true
}
export const VideoSelector = {
  name: "Video",
  Icon: Recorder,
  accept: [".mp4", ".mov", ".qt"],
  multiple: true
}

interface FileSelectorProps {
  name: string
  Icon: any
  accept: string[]
  multiple: boolean
}

type MediaSelectorProps = {
  register: FormRegister
  activeMediaHeader?: string
  // setActiveMediaHeader?: (mediaHeader: string) => void
  errors: FormErrors
  options?: FormOptions
  onChange: (event: any) => void
  selectors: FileSelectorProps[]
}

export const MediaSelector: FC<PropsWithChildren<MediaSelectorProps>> = ({
  register,
  errors,
  options = {},
  onChange,
  activeMediaHeader,
  // setActiveMediaHeader = () => null,
  selectors,
  children
}) => {
  return (
    <div className="w-full">
      <div className="relative flex h-full w-full items-center justify-between text-[16px] font-normal">
        <div className="flex items-center">
          <div className="flex w-full flex-wrap justify-between gap-1">
            {selectors.map(({ name, Icon, accept, multiple }) => {
              return (
                <FormInput
                  trigger={
                    <button
                      type="button"
                      className={classNames(
                        activeMediaHeader === name
                          ? " bg-[#FF51A8]/10 "
                          : "hover:bg-[#FF51A8]/10",
                        "group flex flex-shrink-0 items-center rounded-[56px] px-4 py-3 text-sm leading-4 text-[#FF51A8]"
                      )}
                      // onClick={() => setActiveMediaHeader(name)}
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
                  // onBlur={() => setActiveMediaHeader("")}
                  // there's no way to detect closing event
                  type={"file"}
                  register={register}
                  errors={errors}
                  options={{ ...options, onChange }}
                  key={`media-header-${name}`}
                  name={`media-header-${name}`}
                  accept={accept as any}
                  multiple={multiple}
                  className={classNames(
                    activeMediaHeader === name
                      ? " bg-[#FF51A8]/10 "
                      : "hover:bg-[#FF51A8]/10",
                    "group flex flex-shrink-0 items-center rounded-[56px] px-4 py-3 text-sm leading-4 text-[#FF51A8]"
                  )}
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
