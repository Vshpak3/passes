import { yupResolver } from "@hookform/resolvers/yup"
import { ContentDto } from "@passes/api-client"
import classNames from "classnames"
import { ChangeEvent, FC, KeyboardEvent, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

import { CalendarSelector } from "src/components/atoms/calendar/CalendarSelector"
import { Checkbox } from "src/components/atoms/input/Checkbox"
import { NumberInput } from "src/components/atoms/input/NumberInput"
import { ScheduleAlert } from "src/components/atoms/ScheduleAlert"
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
  const onMediaChange = (event: ChangeEvent<HTMLInputElement>) => {
    setActiveMediaHeader("")
    addNewMedia(event.target.files)
    event.target.value = ""
  }

  useEffect(() => {
    // Any time we receive an error, just show the first one
    const errorMessages = Object.entries(errors).map((e) => e[1].message)
    if (errorMessages.length) {
      toast.error(errorMessages[0])
    }
  }, [errors])

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
      className="grid w-full grid-cols-3 border-t border-[#fff]/10"
      onSubmit={handleSubmit(submitMessage)}
    >
      <div className="order-2 col-span-3 flex flex-col sm:order-1 sm:col-span-3">
        <div className="flex h-[30px] items-center justify-start gap-4 py-1">
          <div className="flex w-full items-center justify-between py-1">
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
              <div className="rounded-xs relative flex items-center shadow-sm">
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
        </div>

        <div className="flex h-fit w-full flex-col items-start justify-start px-3 py-1">
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
            <div className="relative  max-w-[390px] sm:max-w-[590px]">
              <MediaSection
                addNewMedia={addNewMedia}
                errors={errors}
                files={files}
                isPaid={isPaid}
                mediaPreviewIndex={mediaPreviewIndex}
                onRemove={onRemove}
                register={register}
                setFiles={setFiles}
                setMediaPreviewIndex={setMediaPreviewIndex}
                // messages={true}
              />
            </div>
          )}

          {scheduledTime && (
            <ScheduleAlert
              onRemoveScheduledPostTime={() => setScheduledTime(null)}
              scheduledPostTime={scheduledTime}
            />
          )}
          <div className="flex w-full items-center justify-between pb-3 pt-1">
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
              className="flex min-w-[151px] items-center justify-start  rounded-[50px] bg-[#C943A8] py-2 px-4 text-[16px] font-bold leading-[25px] text-white"
              type="submit"
            >
              {scheduledTime ? "Schedule message" : "Send message"}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
