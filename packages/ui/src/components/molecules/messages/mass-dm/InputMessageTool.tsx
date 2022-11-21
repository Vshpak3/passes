import { yupResolver } from "@hookform/resolvers/yup"
import { ContentBareDto, ContentDto } from "@passes/api-client"
import classNames from "classnames"
import {
  ChangeEvent,
  FC,
  KeyboardEvent,
  memo,
  useEffect,
  useState
} from "react"
import { useForm } from "react-hook-form"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { CalendarSelector } from "src/components/atoms/calendar/CalendarSelector"
import { DragDrop } from "src/components/atoms/DragDrop"
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
import { MediaSectionReorder } from "src/components/organisms/MediaSectionReorder"
import {
  MediaSelector,
  PhotoSelector,
  VideoSelector
} from "src/components/organisms/MediaSelector"
import { ContentService } from "src/helpers/content"
import { errorMessage } from "src/helpers/error"
import { ContentFile, useMedia } from "src/hooks/useMedia"

type MessageSaveFunction = (
  text: string,
  contentIds: string[],
  price: number,
  previewIndex: number,
  contents: ContentBareDto[],
  scheduledAt?: Date
) => Promise<void> | void
interface InputMessageToolProps {
  vaultContent: ContentDto[]
  clear: () => void
  save: MessageSaveFunction
  schedulable: boolean
  customButtonText?: string
  initialData?: Partial<InputMessageFormProps>
}

const InputMessageToolUnmemo: FC<InputMessageToolProps> = ({
  vaultContent,
  clear,
  save,
  schedulable = true,
  customButtonText,
  initialData
}) => {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue
  } = useForm<InputMessageFormProps>({
    defaultValues: { ...InputMessageFormDefaults, ...initialData },
    resolver: yupResolver(newMessageFormSchema)
  })
  const { files, setFiles, addNewMedia, onRemove, addContent } = useMedia([
    ...vaultContent.map((content) => new ContentFile(undefined, content)),
    ...(initialData?.files ?? [])
  ])
  useEffect(() => {
    setValue("files", files, { shouldValidate: true })
  }, [files, setValue])

  const [activeMediaHeader, setActiveMediaHeader] = useState("Media")
  const isPaid = watch("isPaid")
  const mediaPreviewIndex = watch("previewIndex")
  const onMediaChange = (event: ChangeEvent<HTMLInputElement>) => {
    setActiveMediaHeader("")
    addNewMedia(event.target.files)
    event.target.value = ""
  }

  const onSubmit = async () => {
    const contents = await new ContentService().uploadUserContentBare({
      files,
      inMessage: true
    })

    const values = getValues()
    try {
      await save(
        values.text,
        contents.map((content) => content.contentId),
        isPaid ? parseFloat(values.price) : 0,
        isPaid ? mediaPreviewIndex : 0,
        contents,
        values.scheduledAt ?? undefined
      )
      setFiles([])
      clear()
      reset()
    } catch (err) {
      errorMessage(err, true)
    }
  }

  const resize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto"
    e.target.style.height = Math.min(2 + e.target.scrollHeight, 500) + "px"
  }

  const submitMessage = async () => {
    try {
      await onSubmit()
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

  const scheduledTime = watch("scheduledAt")
  return (
    <form
      className="flex w-full border-t border-passes-gray"
      onSubmit={handleSubmit(submitMessage)}
    >
      <DragDrop onChange={(event) => addNewMedia(event.dataTransfer.files)}>
        {({ isDragging }) => (
          <div
            className={classNames(
              isDragging
                ? "sm:border sm:border-dashed sm:border-passes-primary-color sm:backdrop-brightness-125"
                : "sm:border sm:border-transparent",
              "flex w-full flex-col px-[30px] pt-2"
            )}
          >
            <input className="hidden" multiple name="files" type="file" />
            <div className="flex w-full items-center justify-between py-1 pb-[10px]">
              <div className="flex h-[30px] items-center justify-start gap-4">
                <Checkbox
                  className="group"
                  errors={errors}
                  label="Pay to View"
                  name="isPaid"
                  register={register}
                  type="toggle"
                />
                {isPaid ? (
                  <div className="relative flex items-center shadow-sm">
                    <div className="absolute left-4 text-[14px] font-bold leading-[25px] text-white/40">
                      Price
                    </div>
                    <NumberInput
                      className="h-[40px] w-full rounded-md border-passes-dark-200 bg-[#100C11] p-0 px-[18px] py-[10px] text-right text-base font-bold text-white/90"
                      name="price"
                      register={register}
                      type="currency"
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <textarea
              cols={40}
              placeholder="Send a message.."
              {...register("text")}
              autoComplete="off"
              className={classNames(
                files.length
                  ? "focus:border-b-transparent"
                  : errors.text && "border-b-red",
                "w-full resize-none border-x-0 border-b border-transparent bg-transparent p-2 text-white/90 focus:border-transparent focus:border-b-passes-primary-color focus:ring-0 md:m-0 md:p-0"
              )}
              onInput={resize}
              // onFocus={() => {
              //   clearErrors()
              // }}
              onKeyDown={submitOnEnter}
            />
            {files.length > 0 && (
              <div className="flex">
                <MediaSectionReorder
                  addNewMedia={addNewMedia}
                  errors={errors}
                  files={files}
                  isPaid={isPaid}
                  mediaPreviewIndex={mediaPreviewIndex}
                  onRemove={onRemove}
                  register={register}
                  setFiles={setFiles}
                  setMediaPreviewIndex={(index) =>
                    setValue("previewIndex", index)
                  }
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
                <Button
                  big
                  className="w-[120px] !px-0 md:w-[150px]"
                  disabled={isSubmitting}
                  fontSize={16}
                  type={ButtonTypeEnum.SUBMIT}
                >
                  {customButtonText ??
                    (scheduledTime ? "Schedule message" : "Send message")}
                </Button>
              </div>
            </div>

            {scheduledTime && (
              <ScheduleAlert
                onRemoveScheduledPostTime={() => setScheduledTime(null)}
                scheduledPostTime={scheduledTime}
              />
            )}
          </div>
        )}
      </DragDrop>
    </form>
  )
}

export const InputMessageTool = memo(InputMessageToolUnmemo)
