import { FC } from "react"
import { Button, ButtonTypeEnum } from "src/components/atoms/Button"
import { CalendarSelector } from "src/components/atoms/calendar/CalendarSelector"
import { PostScheduleAlert } from "src/components/atoms/PostScheduleAlert"
import { Text } from "src/components/atoms/Text"

import { MediaSelector } from "./MediaSelector"

interface NewPostEditorFooterProps {
  disableForm?: boolean
  setScheduledTime: (date: Date | null) => void
  scheduledTime: Date | null
}

export const NewPostEditorFooter: FC<NewPostEditorFooterProps> = ({
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

        <Button
          className="flex items-center justify-center rounded-[30px] bg-passes-pink-100 px-4 py-2 text-base font-bold text-[#ffffff]/90 sm:rounded-[50px] sm:py-2.5 sm:px-8"
          tag="button"
          type={ButtonTypeEnum.SUBMIT}
          disabled={disableForm}
          disabledClass="opacity-[0.5]"
        >
          <Text fontSize={16} className="font-bold">
            Post
          </Text>
        </Button>
      </div>
    </div>
  )
}
