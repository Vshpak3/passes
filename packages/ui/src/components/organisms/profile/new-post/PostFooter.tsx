import { FC } from "react"
import { PostScheduleAlert } from "src/components/atoms/PostScheduleAlert"

import { CalendarSelector } from "./CalendarPicker"
import { MediaSelector } from "./MediaSelector"

interface PostFooterProps {
  disableForm?: boolean
  setScheduledTime: (date: Date | null) => void
  scheduledTime: Date | null
}

export const PostFooter: FC<PostFooterProps> = ({
  disableForm,
  setScheduledTime,
  scheduledTime
}) => {
  return (
    <div className="w-full">
      {scheduledTime && (
        <PostScheduleAlert
          scheduledPostTime={scheduledTime}
          onRemoveScheduledPostTime={() => setScheduledTime(null)}
        />
      )}
      <div className="mt-4 flex justify-end gap-[10px]">
        <div className="flex">
          <div className="flex w-full flex-wrap justify-between gap-1">
            <MediaSelector name="Media" activeHeader="Media" />
            <CalendarSelector
              name="Schedule"
              activeHeader="Schedule"
              setScheduledTime={setScheduledTime}
              scheduledTime={scheduledTime}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={disableForm}
          className="flex items-center justify-center rounded-[30px] bg-passes-pink-100 px-4 py-2 text-base font-bold text-[#ffffff]/90 sm:rounded-[50px] sm:py-2.5 sm:px-8"
        >
          Post
        </button>
      </div>
    </div>
  )
}
