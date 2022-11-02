import { ContentDto, PayinDataDtoBlockedEnum } from "@passes/api-client"
import { MessagesApi } from "@passes/api-client/apis"
import { AnyObject } from "chart.js/types/basic"
import classNames from "classnames"
import { debounce } from "lodash"
import React, {
  ChangeEvent,
  Dispatch,
  FC,
  KeyboardEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from "react"
import { useForm } from "react-hook-form"

import { Button } from "src/components/atoms/Button"
import { Checkbox } from "src/components/atoms/input/Checkbox"
import { Text } from "src/components/atoms/Text"
import { VaultSelector } from "src/components/atoms/VaultSelector"
import { MediaSection } from "src/components/organisms/MediaSection"
import {
  MediaSelector,
  PhotoSelector,
  VideoSelector
} from "src/components/organisms/MediaSelector"
import { ContentService } from "src/helpers/content"
import { preventNegative } from "src/helpers/keyboard"
import { useTippedMessageModal } from "src/hooks/context/useTippedMessageModal"
import { ContentFile, useMedia } from "src/hooks/useMedia"
import { usePay } from "src/hooks/usePay"

interface InputMessageFormProps {
  message: string
  isPaid: boolean
  previewIndex: string
  submitError: AnyObject
}

interface InputMessageProps {
  channelId: string
  minimumTip?: number | null
  isCreator: boolean
  otherUserIsCreator?: boolean
  vaultContent: ContentDto[]
  setVaultContent: Dispatch<SetStateAction<ContentDto[]>>
  removeFree: () => void
}

const api = new MessagesApi()

export const InputMessage: FC<InputMessageProps> = ({
  channelId,
  minimumTip,
  isCreator,
  vaultContent,
  setVaultContent,
  removeFree
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    clearErrors,
    reset,
    watch
  } = useForm<InputMessageFormProps>()
  const [tip, setTip] = useState(0)
  const message = watch("message", "")
  const { files, setFiles, addNewMedia, onRemove, addContent } = useMedia(
    vaultContent.map((content) => new ContentFile(undefined, content))
  )
  const [reorderContent, setReorderContent] = useState(false)
  const [activeMediaHeader, setActiveMediaHeader] = useState("Media")
  const [messagePrice, setMessagePrice] = useState<number>(0)
  const isPaid = watch("isPaid")
  const [mediaPreviewIndex, setMediaPreviewIndex] = useState(0)

  const onMediaChange = (event: ChangeEvent<HTMLInputElement>) => {
    setActiveMediaHeader("")
    addNewMedia(event.target.files)
    event.target.value = ""
  }

  const { setTippedMessage, setOnSuccess } = useTippedMessageModal()

  const clear = () => {
    setFiles([])
    setMessagePrice(0)
    setVaultContent([])
    reset()
    if (!tip) {
      removeFree()
    }
  }

  const getRequest = async () => {
    const contentIds = await new ContentService().uploadUserContent({
      files,
      inMessage: true
    })
    return {
      text: message,
      contentIds: contentIds,
      channelId,
      tipAmount: tip,
      price: isPaid ? messagePrice : 0,
      previewIndex: isPaid ? mediaPreviewIndex : 0
    }
  }

  const registerMessage = async () => {
    const result = await api.sendMessage({
      sendMessageRequestDto: await getRequest()
    })

    clear()

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
        // submit()
        setOnSuccess(clear)
        setTippedMessage(await getRequest())
        reset()
      }
    } catch (error) {
      setError("submitError", {
        type: "custom",
        message: "There was an error sending the message"
      })
    }
  }

  const onCallback = (error: unknown) => {
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

  useEffect(() => {
    if (channelId && !isNaN(tip)) {
      const fetch = async () => {
        await submitData(tip)
      }
      fetch()
    }
  }, [channelId, message, submitData, tip])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessagePrice(parseFloat(event.target.value))
  }

  const options = {}
  return (
    <form
      className="flex w-full border-t border-[#fff]/10"
      onSubmit={handleSubmit(submitMessage)}
    >
      <div className="flex w-full flex-col px-[30px]">
        {isCreator && (
          <div className="flex w-full items-center justify-between pt-2">
            <div className="flex min-h-[45px] items-center justify-start gap-4 ">
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
                <div className="relative flex items-center rounded-md shadow-sm">
                  <div className="absolute left-4 text-[14px] font-bold leading-[25px] text-[#ffffff]/40">
                    Price
                  </div>
                  <input
                    aria-placeholder="$"
                    autoFocus
                    className="min-w-[121px] max-w-[121px] rounded-md border-passes-dark-200 bg-[#100C11] py-1 pr-4 text-right text-[14px] font-bold leading-[25px] text-[#ffffff]/90  focus:border-passes-primary-color focus:ring-0"
                    id="postPrice"
                    max="5000"
                    min="0"
                    name="postPrice"
                    onChange={handleChange}
                    onKeyPress={preventNegative}
                    placeholder="$"
                    step="0.01"
                    type="number"
                    value={messagePrice}
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
        )}

        <div className="pt-3">
          <textarea
            cols={40}
            placeholder="Send a message.."
            rows={4}
            {...register("message", { required: true })}
            autoComplete="off"
            className={classNames(
              files.length
                ? "focus:border-b-transparent"
                : errors.message && "border-b-red",
              "w-full resize-none border-x-0 border-b border-transparent bg-transparent p-2 text-[#ffffff]/90 focus:border-transparent focus:border-b-passes-primary-color focus:ring-0 md:m-0 md:p-0"
            )}
            onFocus={() => {
              clearErrors()
            }}
            onKeyDown={submitOnEnter}
          />
        </div>
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
              reorderContent={reorderContent}
              setFiles={setFiles}
              setMediaPreviewIndex={setMediaPreviewIndex}
              // messages={true}
            />
          </div>
        )}
        <div className="-ml-4 flex w-full items-center justify-between py-3">
          {isCreator && (
            <MediaSelector
              activeMediaHeader={activeMediaHeader}
              errors={errors}
              onChange={onMediaChange}
              register={register}
              selectors={[PhotoSelector, VideoSelector]}
            >
              <VaultSelector selectVaultContent={addContent} />
            </MediaSelector>
          )}
          <div className="flex w-full justify-end gap-[10px]">
            {/* TODO: Patrick add here condition if otherUserId is not creator line 281-310 */}
            <div
              className={classNames(
                errors.message && "border-b-red",
                "flex h-[45px] w-full min-w-[150px] max-w-[150px] items-center justify-between  rounded-[6px] border border-[#B52A6F] px-3 py-[6px]"
              )}
            >
              <div className="flex w-3/5 flex-col items-start">
                <span className="text-[14px] font-medium leading-[14px] text-[#B52A6F]">
                  Tip:
                </span>
                {blocked === PayinDataDtoBlockedEnum.InsufficientTip ? (
                  <span className="whitespace-nowrap text-[11px] font-normal leading-[13px] text-red-500">
                    minimum ${minimumTip ? minimumTip.toFixed(2) : "0.00"}
                  </span>
                ) : null}
              </div>
              <input
                autoComplete="off"
                className=" w-2/5 border-none bg-transparent p-0 pl-3 text-center text-[16px] font-bold leading-[25px] text-white placeholder-[#888689] outline-0 ring-0 focus:outline-0 focus:ring-0"
                min="0"
                onChange={handleChangeTip}
                onKeyPress={preventNegative}
                placeholder="0.00"
                step=".01"
                type="number"
              />
            </div>
            <div
              aria-roledescription="button"
              className="messaging-input__button h-[45px]  !p-0"
              role="button"
            >
              <button
                className={classNames(
                  blocked ? " cursor-not-allowed opacity-50" : "",
                  " min-w-[150px] cursor-pointer items-center justify-center rounded-[5px] bg-[#B52A6F] py-[10px] px-[18px] text-center text-[16px] leading-[25px] text-white"
                )}
                disabled={!isNaN(tip) && !!blocked}
                onClick={submit}
                type="button"
              >
                {submitting
                  ? "Sending..."
                  : blocked ===
                    PayinDataDtoBlockedEnum.TooManyPurchasesInProgress
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
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
