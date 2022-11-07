import { yupResolver } from "@hookform/resolvers/yup"
import { ContentDto } from "@passes/api-client"
import classNames from "classnames"
import { ChangeEvent, FC, KeyboardEvent, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "src/components/atoms/Button"
import { CalendarSelector } from "src/components/atoms/calendar/CalendarSelector"
import { Checkbox } from "src/components/atoms/input/Checkbox"
import { NumberInput } from "src/components/atoms/input/NumberInput"
import { ScheduleAlert } from "src/components/atoms/ScheduleAlert"
import { Text } from "src/components/atoms/Text"
import { VaultSelector } from "src/components/atoms/VaultSelector"
import {
  InputMessageFormDefaults,
  InputMessageFormProps,
  newMessageFormSchema
} from "src/components/molecules/messages/InputMessage"
import { MediaSection } from "src/components/organisms/MediaSection"
import {
  MediaSelector,
  PhotoSelector,
  VideoSelector
} from "src/components/organisms/MediaSelector"
import { MAX_PAID_MESSAGE_PRICE } from "src/config/messaging"
import { ContentService } from "src/helpers/content"
import { errorMessage } from "src/helpers/error"
import { ContentFile, useMedia } from "src/hooks/useMedia"

interface InputMessageGeneralProps {
  vaultContent: ContentDto[]
  clear: () => void
  save: (
    text: string,
    contentIds: string[],
    price: number,
    previewIndex: number,
    scheduledAt?: Date
  ) => Promise<void>
  schedulable: boolean
}

export const InputMessageGeneral: FC<InputMessageGeneralProps> = ({
  vaultContent,
  clear,
  save,
  schedulable = true
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue
  } = useForm<InputMessageFormProps>({
    defaultValues: { ...InputMessageFormDefaults },
    resolver: yupResolver(newMessageFormSchema)
  })
  const { files, setFiles, addNewMedia, onRemove, addContent } = useMedia(
    vaultContent.map((content) => new ContentFile(undefined, content))
  )
  useEffect(() => {
    setValue("files", files, { shouldValidate: true })
  }, [files, setValue])

  const [activeMediaHeader, setActiveMediaHeader] = useState("Media")
  const isPaid = watch("isPaid")
  const [mediaPreviewIndex, setMediaPreviewIndex] = useState(0)
  const [reorderContent, setReorderContent] = useState(false)
  const onMediaChange = (event: ChangeEvent<HTMLInputElement>) => {
    setActiveMediaHeader("")
    addNewMedia(event.target.files)
    event.target.value = ""
  }

  const onSubmit = async () => {
    const contentIds = await new ContentService().uploadUserContent({
      files,
      inMessage: true
    })

    const values = getValues()
    try {
      await save(
        values.text,
        contentIds,
        isPaid ? parseFloat(values.price) : 0,
        isPaid ? mediaPreviewIndex : 0,
        values.scheduledAt ?? undefined
      )
      setFiles([])
      clear()
      reset()
    } catch (err) {
      errorMessage(err, true)
    }
  }

  const submitMessage = async () => {
    try {
      onSubmit()
    } catch (error) {
      errorMessage(error, true)
    }
  }

  const submitOnEnter = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.which === 13 && !event.shiftKey) {
      event.preventDefault()
      handleSubmit(submitMessage)()
    }
  }

  const setScheduledTime = (date: Date | null) => {
    setValue("scheduledAt", date, { shouldValidate: true })
  }

  const options = {}
  const scheduledTime = watch("scheduledAt")
  return (
    <form
      className="flex w-full border-t border-[#fff]/10"
      onSubmit={handleSubmit(submitMessage)}
    >
      <div className="flex w-full flex-col px-[30px] pt-2">
        <div className="flex w-full items-center justify-between py-1">
          <div className="flex h-[30px] items-center justify-start gap-4">
            <Checkbox
              className="group"
              errors={errors}
              label="Pay to View"
              name="isPaid"
              options={options}
              register={register}
              type="toggle"
            />
            {isPaid ? (
              <div className="relative flex items-center shadow-sm">
                <div className="absolute left-4 text-[14px] font-bold leading-[25px] text-[#ffffff]/40">
                  Price
                </div>
                <NumberInput
                  className="h-[40px] w-full rounded-md border-passes-dark-200 bg-[#100C11] p-0 px-[18px] py-[10px] text-right text-base font-bold text-[#ffffff]/90"
                  maxInput={MAX_PAID_MESSAGE_PRICE}
                  name="price"
                  register={register}
                  type="currency"
                />
              </div>
            ) : null}
          </div>
          {files.length > 1 && (
            <Button
              className="flex items-center justify-center rounded-[5px] border border-[#FF51A8] bg-transparent px-4 text-base font-bold sm:rounded-[5px] "
              onClick={() => setReorderContent(!reorderContent)}
            >
              <Text className="font-bold text-[#FF51A8]" fontSize={16}>
                {reorderContent ? "Reorder Done" : "Reorder"}
              </Text>
            </Button>
          )}
        </div>

        <textarea
          cols={40}
          placeholder="Send a message.."
          rows={3}
          {...register("text")}
          autoComplete="off"
          className={classNames(
            files.length
              ? "focus:border-b-transparent"
              : errors.text && "border-b-red",
            "w-full resize-none border-x-0 border-b border-transparent bg-transparent p-2 text-[#ffffff]/90 focus:border-transparent focus:border-b-passes-primary-color focus:ring-0 md:m-0 md:p-0"
          )}
          // onFocus={() => {
          //   clearErrors()
          // }}
          onKeyDown={submitOnEnter}
        />
        {files.length > 0 && (
          <div className="relative max-w-[390px] sm:max-w-[590px]">
            <MediaSection
              addNewMedia={addNewMedia}
              errors={errors}
              files={files}
              isPaid={isPaid}
              mediaPreviewIndex={mediaPreviewIndex}
              onRemove={onRemove}
              register={register}
              reorderContent={reorderContent}
              setFiles={setFiles}
              setMediaPreviewIndex={setMediaPreviewIndex}
              // messages={true}
            />
          </div>
        )}
        {Object.values(errors)[0] && (
          <Text className="mt-1 block text-[red]" fontSize={12}>
            {Object.values(errors)[0]?.message}
          </Text>
        )}
        <div
          className={classNames(
            Object.values(errors)[0] && "!pt-0",
            "flex w-full flex-wrap items-center justify-between md:-ml-4 md:flex-nowrap md:pt-5 md:pb-2"
          )}
        >
          <div className="flex w-full items-center justify-between">
            <MediaSelector
              activeMediaHeader={activeMediaHeader}
              errors={errors}
              onChange={onMediaChange}
              register={register}
              selectors={[PhotoSelector, VideoSelector]}
              // setActiveMediaHeader={setActiveMediaHeader}
            >
              <VaultSelector selectVaultContent={addContent} />
              {schedulable && (
                <CalendarSelector
                  activeHeader=""
                  name="Schedule"
                  placement="bottom"
                  scheduledTime={scheduledTime}
                  setScheduledTime={setScheduledTime}
                />
              )}
            </MediaSelector>
            <button
              className="min-w-[150px] cursor-pointer items-center justify-center rounded-[5px] bg-[#B52A6F] py-[10px] px-[18px] text-center text-[16px] leading-[25px] text-white"
              type="submit"
            >
              {scheduledTime ? "Schedule message" : "Send message"}
            </button>
          </div>
        </div>

        {scheduledTime && (
          <ScheduleAlert
            onRemoveScheduledPostTime={() => setScheduledTime(null)}
            scheduledPostTime={scheduledTime}
          />
        )}
      </div>
    </form>
  )
}
