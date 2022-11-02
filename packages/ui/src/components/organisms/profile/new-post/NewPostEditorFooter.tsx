import { CircularProgress } from "@mui/material"
import { ContentDto } from "@passes/api-client"
import { Dispatch, FC, SetStateAction } from "react"

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
  reorderButton?: boolean
  reorderContent: boolean
  setReorderContent: Dispatch<SetStateAction<boolean>>
}

export const NewPostEditorFooter: FC<NewPostEditorFooterProps> = ({
  disableForm,
  setScheduledTime,
  scheduledTime,
  addContent,
  reorderButton = false,
  reorderContent,
  setReorderContent
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
        {reorderButton && (
          <Button
            className="flex items-center justify-center rounded-[5px] border  border-[#FF51A8] bg-transparent px-6 py-2 pr-10 text-base  font-bold sm:rounded-[5px] sm:py-2.5 sm:px-8"
            onClick={() => setReorderContent(!reorderContent)}
          >
            <Text className="font-bold text-[#FF51A8]" fontSize={16}>
              {reorderContent ? "Reorder Done" : "Reorder"}
            </Text>
          </Button>
        )}
        <div className="flex">
          <div className="flex w-full flex-wrap justify-between gap-1">
            <VaultSelector expanded selectVaultContent={addContent} />
            <CalendarSelector
              activeHeader="Schedule"
              name="Schedule"
              placement="bottom"
              scheduledTime={scheduledTime}
              setScheduledTime={setScheduledTime}
            />
          </div>
        </div>

        <Button
          className="flex items-center justify-center rounded-[30px] bg-passes-pink-100 px-4 py-2 text-base font-bold text-[#ffffff]/90 sm:rounded-[50px] sm:py-2.5 sm:px-8"
          disabled={disableForm}
          disabledClass="opacity-[0.5]"
          tag="button"
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
