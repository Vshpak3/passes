import { ContentDto, PayinDataDtoBlockedEnum } from "@passes/api-client"
import { MessagesApi } from "@passes/api-client/apis"
import classNames from "classnames"
import { debounce } from "lodash"
import React, {
  Dispatch,
  FC,
  KeyboardEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from "react"
import { useForm } from "react-hook-form"
import { FormInput } from "src/components/atoms/FormInput"
import { VaultSelector } from "src/components/atoms/VaultSelector"
import { MediaSection } from "src/components/organisms/MediaSection"
import {
  MediaSelector,
  PhotoSelector,
  VideoSelector
} from "src/components/organisms/MediaSelector"
import { ContentService } from "src/helpers/content"
import { ContentFile, useMedia } from "src/hooks/useMedia"
import { usePay } from "src/hooks/usePay"

interface Props {
  channelId: string
  minimumTip?: number | null
  isCreator: boolean
  vaultContent: ContentDto[]
  setVaultContent: Dispatch<SetStateAction<ContentDto[]>>
}

const api = new MessagesApi()
export const InputMessage: FC<Props> = ({
  channelId,
  minimumTip,
  isCreator,
  vaultContent,
  setVaultContent
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    // setValue,
    setError,
    clearErrors,
    reset,
    watch
  } = useForm()
  const [tip, setTip] = useState(0)
  const message = watch("message", "")
  const { files, setFiles, addNewMedia, onRemove, addContent } = useMedia(
    vaultContent.map((content) => new ContentFile(undefined, content))
  )
  const [activeMediaHeader, setActiveMediaHeader] = useState("Media")
  // const [scheduled, setScheduled] = useState<any>()
  const [messagePrice, setMessagePrice] = useState<number>(0)
  const isPaid = watch("isPaid")
  // const setScheduledTime = (date: Date | null) => {
  //   setValue("scheduledAt", date, { shouldValidate: true })
  // }

  const onMediaHeaderChange = (prop: any) => {
    setActiveMediaHeader("")
    if (prop?.target?.files.length > 0) {
      return onFileInputChange(prop)
    }
  }

  const onFileInputChange = (event: any) => {
    const files = [...event.target.files] as File[]
    addNewMedia(files)
    event.target.value = ""
  }

  const registerMessage = async () => {
    const contentIds = await new ContentService().uploadContent(
      files,
      undefined,
      {
        inPost: false,
        inMessage: true
      }
    )
    const result = await api.sendMessage({
      sendMessageRequestDto: {
        text: message,
        contentIds: contentIds,
        channelId,
        tipAmount: tip,
        price: Number(messagePrice),
        previewIndex: 0
      }
    })
    setFiles([])
    setMessagePrice(0)
    setVaultContent([])
    reset()
    return result
  }

  const registerMessageData = async () => {
    return await api.sendMessageData({
      sendMessageRequestDto: {
        text: "text",
        contentIds: [],
        channelId,
        tipAmount: tip,
        previewIndex: 0
      }
    })
  }

  const submitMessage = async () => {
    if (!channelId) {
      return false
    }
    try {
      await submitData(tip)
      if (!blocked) {
        submit()
        reset()
      }
    } catch (error) {
      setError("submitError", {
        type: "custom",
        message: "There was an error sending the message"
      })
    }
  }

  const onCallback = (error: any) => {
    if (error) {
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
  const { submitError } = errors
  const { blocked, submitting, submit, submitData } = usePay(
    registerMessage,
    registerMessageData,
    onCallback
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeTip = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setTip(parseFloat(parseFloat(value.length ? value : "0").toFixed(2)))
    }, 100),
    [setTip]
  )

  const prevent = (e: any) => {
    if (e.code === "Minus") {
      e.preventDefault()
    }
  }

  useEffect(() => {
    if (channelId && !isNaN(tip)) {
      const fetch = async () => {
        await submitData(tip)
      }
      fetch()
    }
  }, [channelId, message, submitData, tip])

  const handleChange = (event: any) => {
    const limit = 5
    setMessagePrice(event.target.value.slice(0, limit))
  }
  const options = {}
  return (
    <form
      className="grid w-full grid-cols-3 border-t border-[#fff]/10"
      onSubmit={handleSubmit(submitMessage)}
    >
      <div className="order-2 col-span-3 flex flex-col sm:order-1 sm:col-span-2">
        {isCreator && (
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
                  max="9999"
                  onChange={(event) => handleChange(event)}
                  className="min-w-[121px] max-w-[121px] rounded-md border-passes-dark-200 bg-[#100C11] py-1 pr-4 text-right text-[14px] font-bold leading-[25px] text-[#ffffff]/90  focus:border-passes-primary-color focus:ring-0"
                />
              </div>
            ) : null}
          </div>
        )}

        <div
          className={classNames(
            isCreator ? "py-1" : "py-4",
            "flex h-fit w-full flex-col items-start justify-start px-3"
          )}
        >
          <textarea
            placeholder="Send a message.."
            rows={isCreator ? 3 : 4}
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
              onRemove={onRemove}
              addNewMedia={addNewMedia}
            />
          )}

          {isCreator && (
            <div className="flex w-full items-center justify-between">
              <MediaSelector
                activeMediaHeader={activeMediaHeader}
                // setActiveMediaHeader={setActiveMediaHeader}
                register={register}
                errors={errors}
                onChange={onMediaHeaderChange}
                selectors={[PhotoSelector, VideoSelector]}
              >
                <VaultSelector selectVaultContent={addContent} />
              </MediaSelector>
            </div>
          )}
        </div>
      </div>
      <div className="order-1 col-span-3 h-full border-l border-gray-800 sm:order-2 sm:col-span-1">
        <div className=" flex h-full flex-col justify-between sm:items-center sm:justify-center">
          <div className="flex h-full flex-row items-start justify-between sm:flex-col sm:items-center sm:justify-center sm:py-4">
            <input
              type="number"
              placeholder="0.00"
              onChange={handleChangeTip}
              className={classNames(
                errors.message && "border-b-red",
                "sm:w-ful w-full items-center justify-center border-none bg-transparent p-0 text-center text-[42px] font-bold leading-[53px] text-passes-secondary-color placeholder-purple-300 outline-0 ring-0 focus:outline-0 focus:ring-0"
              )}
              autoComplete="off"
              min="0"
              step=".01"
              onKeyPress={prevent}
            />

            <span className="flex h-full w-full items-center justify-center text-[14px] leading-[24px] text-[#ffff]/50">
              minimum ${minimumTip ? minimumTip.toFixed(2) : "0.00"} tip
            </span>
          </div>
          <div
            className="messaging-input__button w-full !p-0"
            role="button"
            aria-roledescription="button"
          >
            <button
              type="button"
              disabled={!isNaN(tip) && !!blocked}
              className={classNames(
                blocked ? " cursor-not-allowed opacity-50" : "",
                "w-full cursor-pointer items-center justify-center bg-passes-secondary-color py-4 text-center text-[16px] leading-[25px] text-white"
              )}
              onClick={submit}
            >
              {submitting
                ? "Sending..."
                : blocked === PayinDataDtoBlockedEnum.TooManyPurchasesInProgress
                ? "Waiting on Payment"
                : blocked === PayinDataDtoBlockedEnum.DoesNotFollow
                ? "Not following"
                : blocked === PayinDataDtoBlockedEnum.InsufficientTip
                ? "Insufficient tip"
                : blocked === PayinDataDtoBlockedEnum.NoPayinMethod
                ? "No Payment Method (go to settings)"
                : ` Send Message`}
            </button>
            {submitError?.message && (
              <span className="text-red-500">
                {String(submitError.message)}
              </span>
            )}
            {/* {blocked && <span className="text-red-500">{String(blocked)}</span>} */}
          </div>
        </div>
      </div>
    </form>
  )
}
