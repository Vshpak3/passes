import { CircularProgress } from "@mui/material"
import { ContentDto } from "@passes/api-client"
import { FC } from "react"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { CalendarSelector } from "src/components/atoms/calendar/CalendarSelector"
import { ScheduleAlert } from "src/components/atoms/ScheduleAlert"
import { Text } from "src/components/atoms/Text"
import { VaultSelector } from "src/components/atoms/VaultSelector"

interface NewPostEditorFooterProps {
  disableForm?: boolean
  setScheduledTime: (date: Date | null) => void
  scheduledTime: Date | null
  addContent: (content: ContentDto[]) => void
  schedulable: boolean
}

export const NewPostEditorFooter: FC<NewPostEditorFooterProps> = ({
  disableForm,
  setScheduledTime,
  scheduledTime,
  addContent,
  schedulable
}) => {
  return (
    <div className="w-full">
      {scheduledTime && (
        <ScheduleAlert
          onRemoveScheduledPostTime={() => setScheduledTime(null)}
          scheduledPostTime={scheduledTime}
        />
      )}

      <div className="mt-4 flex justify-end gap-[10px]">
        <div className="flex">
          <div className="flex w-full flex-wrap justify-between gap-1">
            <VaultSelector expanded selectVaultContent={addContent} />
            {schedulable && (
              <CalendarSelector
                activeHeader="Schedule"
                name="Schedule"
                placement="bottom"
                scheduledTime={scheduledTime}
                setScheduledTime={setScheduledTime}
              />
            )}
          </div>
        </div>

        <Button
          className="flex items-center justify-center rounded-[5px] bg-passes-pink-100 py-[10px] px-[20px] text-base font-bold text-white/90"
          disabled={disableForm}
          disabledClass="opacity-[0.5]"
          type={ButtonTypeEnum.SUBMIT}
        >
          <Text className="font-bold" fontSize={16}>
            {disableForm ? (
              <CircularProgress color="inherit" size="14px" />
            ) : (
              "Post"
            )}
          </Text>
        </Button>
      </div>
    </div>
  )
}
