import { ContentDto, ListDto, PassDto } from "@passes/api-client"
import { MessagesApi } from "@passes/api-client/apis"
import classNames from "classnames"
import React, {
  ChangeEvent,
  Dispatch,
  FC,
  KeyboardEvent,
  SetStateAction,
  useState
} from "react"
import { useForm } from "react-hook-form"

import { CalendarSelector } from "src/components/atoms/calendar/CalendarSelector"
import { FormInput } from "src/components/atoms/FormInput"
import { ScheduleAlert } from "src/components/atoms/ScheduleAlert"
import { VaultSelector } from "src/components/atoms/VaultSelector"
import { MediaSection } from "src/components/organisms/MediaSection"
import {
  MediaSelector,
  PhotoSelector,
  VideoSelector
} from "src/components/organisms/MediaSelector"
import { ContentService } from "src/helpers/content"
import { errorMessage } from "src/helpers/error"
import { ContentFile, useMedia } from "src/hooks/useMedia"

interface InputMessageMassDMProps {
  vaultContent: ContentDto[]
  setVaultContent: Dispatch<SetStateAction<ContentDto[]>>
  selectedPasses: PassDto[]
  setSelectedPasses: Dispatch<SetStateAction<PassDto[]>>
  selectedLists: ListDto[]
  setSelectedLists: Dispatch<SetStateAction<ListDto[]>>
  excludedLists: ListDto[]
  setExcludedLists: Dispatch<SetStateAction<ListDto[]>>
  setMassMessage: Dispatch<SetStateAction<boolean>>
}

export const InputMessageMassDM: FC<InputMessageMassDMProps> = ({
  vaultContent,
  setVaultContent,
  selectedPasses,
  setSelectedPasses,
  selectedLists,
  setSelectedLists,
  excludedLists,
  setExcludedLists,
  setMassMessage
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    clearErrors,
    reset,
    watch,
    getValues,
    setValue
  } = useForm()
  const message = watch("message", "")
  const { files, setFiles, addNewMedia, onRemove, addContent } = useMedia(
    vaultContent.map((content) => new ContentFile(undefined, content))
  )
  const [activeMediaHeader, setActiveMediaHeader] = useState("Media")
  const [messagePrice, setMessagePrice] = useState<number>(0)
  const isPaid = watch("isPaid")
  const previewIndex = watch("previewIndex")

  const onMediaChange = (event: ChangeEvent<HTMLInputElement>) => {
    setActiveMediaHeader("")
    if (event?.target?.files && event.target.files.length > 0) {
      addNewMedia(Array.from(event.target.files))
      event.target.value = ""
    }
  }

  const onSubmit = async () => {
    const messagesApi = new MessagesApi()
    const listIds = selectedLists.map((s) => s.listId)
    const passIds = selectedPasses.map((s) => s.passId)
    const excludedIds = excludedLists.map((s) => s.listId)

    const contentIds = await new ContentService().uploadUserContent({
      files,
      inMessage: true
    })
    try {
      await messagesApi.massSend({
        createBatchMessageRequestDto: {
          includeListIds: listIds,
          excludeListIds: excludedIds,
          passIds: passIds,
          text: message,
          contentIds: contentIds,
          price: messagePrice,
          previewIndex: previewIndex ? parseInt(previewIndex) : 0,
          scheduledAt: getValues()?.scheduledAt ?? undefined
        }
      })
      setFiles([])
      setMessagePrice(0)
      setVaultContent([])
      setSelectedLists([])
      setSelectedPasses([])
      setExcludedLists([])
      setMassMessage(false)
      reset()
    } catch (err) {
      errorMessage(err, true)
    }
  }

  const submitMessage = async () => {
    try {
      onSubmit()
    } catch (error) {
      setError("submitError", {
        type: "custom",
        message: "There was an error sending the message"
      })
    }
  }

  const submitOnEnter = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.which === 13 && !event.shiftKey) {
      event.preventDefault()
      handleSubmit(submitMessage)()
    }
  }

  const prevent = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Minus") {
      e.preventDefault()
    }
  }

  const setScheduledTime = (date: Date | null) => {
    setValue("scheduledAt", date, { shouldValidate: true })
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessagePrice(parseFloat(event.target.value))
  }

  const options = {}
  const scheduledTime = getValues()?.scheduledAt
  return (
    <form
      className="grid w-full grid-cols-3 border-t border-[#fff]/10"
      onSubmit={handleSubmit(submitMessage)}
    >
      <div className="order-2 col-span-3 flex flex-col sm:order-1 sm:col-span-3">
        <div className="flex min-h-[45px] items-center justify-start gap-4 px-3 pt-2">
          <FormInput
            label="Pay to View"
            type="toggle"
            register={register}
            errors={errors}
            options={options}
            name="isPaid"
            className="group"
          />
          {isPaid ? (
            <div className="relative flex items-center rounded-md shadow-sm">
              <div className="absolute left-4 text-[14px] font-bold leading-[25px] text-[#ffffff]/40">
                Price
              </div>
              <input
                type="number"
                value={messagePrice}
                name="postPrice"
                autoFocus
                id="postPrice"
                placeholder="$"
                aria-placeholder="$"
                onKeyPress={prevent}
                min="0"
                max="5000"
                step="0.01"
                onChange={handleChange}
                className="min-w-[121px] max-w-[121px] rounded-md border-passes-dark-200 bg-[#100C11] py-1 pr-4 text-right text-[14px] font-bold leading-[25px] text-[#ffffff]/90  focus:border-passes-primary-color focus:ring-0"
              />
            </div>
          ) : null}
        </div>

        <div className="flex h-fit w-full flex-col items-start justify-start px-3 py-1">
          <textarea
            placeholder="Send a message.."
            rows={3}
            cols={40}
            {...register("message", { required: true })}
            className={classNames(
              files.length
                ? "focus:border-b-transparent"
                : errors.message && "border-b-red",
              "w-full resize-none border-x-0 border-b border-transparent bg-transparent p-2 text-[#ffffff]/90 focus:border-transparent focus:border-b-passes-primary-color focus:ring-0 md:m-0 md:p-0"
            )}
            autoComplete="off"
            onKeyDown={submitOnEnter}
            onFocus={() => {
              clearErrors()
            }}
          />
          {files.length > 0 && (
            <MediaSection
              register={register}
              errors={errors}
              files={files}
              setFiles={setFiles}
              onRemove={onRemove}
              addNewMedia={addNewMedia}
              messages={true}
            />
          )}

          {scheduledTime && (
            <ScheduleAlert
              scheduledPostTime={scheduledTime}
              onRemoveScheduledPostTime={() => setScheduledTime(null)}
            />
          )}
          <div className="flex w-full items-center justify-between pt-6">
            <MediaSelector
              activeMediaHeader={activeMediaHeader}
              // setActiveMediaHeader={setActiveMediaHeader}
              register={register}
              errors={errors}
              onChange={onMediaChange}
              selectors={[PhotoSelector, VideoSelector]}
            >
              <VaultSelector selectVaultContent={addContent} />
              <CalendarSelector
                name="Schedule"
                activeHeader=""
                setScheduledTime={setScheduledTime}
                scheduledTime={scheduledTime}
                placement="bottom"
              />
            </MediaSelector>
            <button
              type="submit"
              className="flex min-w-[151px] items-center justify-start  rounded-[50px] bg-[#C943A8] py-2 px-4 text-[16px] font-bold leading-[25px] text-white"
            >
              {scheduledTime ? "Schedule message" : "Send message"}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
