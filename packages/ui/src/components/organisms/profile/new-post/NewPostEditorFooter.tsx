import { CircularProgress } from "@mui/material"
import { ContentDto } from "@passes/api-client"
import { FC } from "react"

import { Button, ButtonTypeEnum } from "src/components/atoms/Button"
import { CalendarSelector } from "src/components/atoms/calendar/CalendarSelector"
import { ScheduleAlert } from "src/components/atoms/ScheduleAlert"
import { Text } from "src/components/atoms/Text"
import { VaultSelector } from "src/components/atoms/VaultSelector"

interface NewPostEditorFooterProps {
  disableForm?: boolean
  setScheduledTime: (date: Date | null) => void
  scheduledTime: Date | null
  addContent: (content: ContentDto[]) => void
}

export const NewPostEditorFooter: FC<NewPostEditorFooterProps> = ({
  disableForm,
  setScheduledTime,
  scheduledTime,
  addContent
}) => {
  return (
    <div className="w-full">
      {scheduledTime && (
        <ScheduleAlert
          scheduledPostTime={scheduledTime}
          onRemoveScheduledPostTime={() => setScheduledTime(null)}
        />
      )}
      <div className="mt-4 flex justify-end gap-[10px]">
        <div className="flex">
          <div className="flex w-full flex-wrap justify-between gap-1">
            <VaultSelector selectVaultContent={addContent} expanded={true} />
            <CalendarSelector
              name="Schedule"
              activeHeader="Schedule"
              setScheduledTime={setScheduledTime}
              scheduledTime={scheduledTime}
              placement="bottom"
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
            {disableForm ? (
              <CircularProgress size="14px" color="inherit" />
            ) : (
              "Post"
            )}
          </Text>
        </Button>
      </div>
    </div>
  )
}
