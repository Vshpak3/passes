import classNames from "classnames"
import Photos from "public/icons/profile-photos1-icon.svg"
import { FC } from "react"

interface MediaSelectorProps {
  name: string
  activeHeader: string | undefined
}

export const MediaSelector: FC<MediaSelectorProps> = ({
  name,
  activeHeader
}) => {
  return (
    <button
      type="button"
      className={classNames(
        activeHeader === name
          ? " bg-[rgba(191,122,240,0.1)] "
          : "hover:bg-[rgba(191,122,240,0.1)]",
        "group flex flex-shrink-0 items-center rounded-[56px] py-3 px-3 text-sm leading-4 text-passes-secondary-color sm:px-4"
      )}
      onClick={() => undefined}
    >
      <span className="flex flex-shrink-0 cursor-pointer items-center gap-1">
        <Photos className="flex flex-shrink-0" />
        <span
          className={classNames(
            activeHeader === name ? "block" : "hidden group-hover:block",
            "block"
          )}
        >
          {name}
        </span>
      </span>
    </button>
  )
}
