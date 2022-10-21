import { PayinDataDtoBlockedEnum } from "@passes/api-client"
import { MessagesApi } from "@passes/api-client/apis"
import classNames from "classnames"
import { debounce } from "lodash"
import PlusIcon from "public/icons/post-plus-icon.svg"
import React, {
  FC,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState
} from "react"
import { useForm } from "react-hook-form"
import { FormInput } from "src/components/atoms/FormInput"
import { MessagesVaultDialog } from "src/components/molecules/direct-messages/messages-vault-dialog"
import {
  Media,
  MediaFile
} from "src/components/organisms/profile/main-content/new-post/Media"
import { MediaHeader } from "src/components/organisms/profile/main-content/new-post/MediaHeader"
import { ContentService } from "src/helpers/content"
import { usePay } from "src/hooks/usePay"

interface Props {
  channelId: string
  minimumTip?: number | null
  isCreator: boolean
  user: any
}

const MB = 1048576
const MAX_FILE_SIZE = 10 * MB
const MAX_FILES = 9

const api = new MessagesApi()
export const InputMessage: FC<Props> = ({
  channelId,
  minimumTip,
  isCreator,
  user
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    clearErrors,
    reset,
    watch
  } = useForm()
  const [tip, setTip] = useState(0)
  const message = watch("message")
  const [files, setFiles] = useState<any[]>([])
  const [contentIds, setContentIds] = useState<any[]>([])
  const [activeMediaHeader, setActiveMediaHeader] = useState("Media")
  const [hasVault, setHasVault] = useState(false)
  // const [scheduled, setScheduled] = useState<any>()
  const [postPrice, setPostPrice] = useState<number>(0)
  const isPaid = watch("isPaid")

  const onMediaHeaderChange = (prop: any) => {
    // if (Object.prototype.toString.call(prop) === "[object Date]") {
    //   setScheduled(prop)
    //   return
    // }
    // TODO: Scheduled message will be added later
    if (prop?.target?.files.length > 0) {
      return onFileInputChange(prop)
    } else if (prop === "Vault") {
      setHasVault(true)
    }
    setActiveMediaHeader(prop)
  }

  const onFileInputChange = (event: any) => {
    const files = [...event.target.files]
    onMediaChange(files)
    event.target.value = ""
  }

  const onMediaChange = (filesProp: any) => {
    let maxFileSizeExceeded = false
    const _files = filesProp.filter((file: any) => {
      if (!MAX_FILE_SIZE) {
        return true
      }
      if (file.size < MAX_FILE_SIZE) {
        return true
      }
      maxFileSizeExceeded = true
      return false
    })

    if (maxFileSizeExceeded) {
      // TODO: show error message
    }

    if (files.length + _files.length > MAX_FILES) {
      return
    } // TODO: max file limit error message
    setFiles([...files, ..._files])
  }

  const registerMessage = async () => {
    let contentIdsToUpload: any[] = []
    if (files.length > 0) {
      const uploadedContentIds = await new ContentService().uploadContent(
        files,
        undefined,
        {
          inPost: false,
          inMessage: true
        }
      )
      contentIdsToUpload = [...uploadedContentIds, ...contentIds]
    }
    if (contentIds.length > 0) {
      contentIdsToUpload = [...contentIds, ...contentIdsToUpload]
    }
    const result = await api.sendMessage({
      sendMessageRequestDto: {
        text: message,
        contentIds: contentIdsToUpload,
        channelId,
        tipAmount: tip,
        price: Number(postPrice),
        previewIndex: 0
      }
    })
    setFiles([])
    setPostPrice(0)
    setContentIds([])
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
  const onRemove = (index: any) => {
    setFiles(files.filter((_: any, i: any) => i !== index))
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
    setPostPrice(event.target.value.slice(0, limit))
  }

  const options = {}
  return (
    <form
      className="grid w-full grid-cols-3 border-t border-[#fff]/10"
      onSubmit={handleSubmit(submitMessage)}
    >
      <div className="order-2 col-span-3 sm:order-1 sm:col-span-2">
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
                  value={postPrice}
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
          {(files.length > 0 || contentIds.length > 0) && (
            <div
              className={classNames(
                message.length
                  ? "border-b-passes-primary-color"
                  : "border-[#2C282D]",
                "w-full items-center self-start overflow-y-auto border-x-0 border-b border-[#2C282D] pt-1 pb-5"
              )}
            >
              <div className="flex w-full flex-col items-start justify-start gap-6 overflow-hidden rounded-lg  border-transparent p-1">
                <div className="flex items-center justify-start gap-6">
                  <div className="flex max-w-[190px] flex-nowrap items-center gap-6 overflow-x-auto md:max-w-[320px]">
                    {contentIds.map((contentId, index) => (
                      <div
                        key={index}
                        className="relative flex  flex-shrink-0 items-center justify-center rounded-[6px]"
                      >
                        <Media
                          onRemove={() => onRemove(index)}
                          src={`${process.env.NEXT_PUBLIC_CDN_URL}/media/${user?.id}/${contentId}.jpeg`}
                          type="image"
                          // TODO:this logic should be done on backend
                        />
                      </div>
                    ))}
                    {files.map((file: any, index: any) => (
                      <div
                        key={index}
                        className="border-1 relative flex flex-shrink-0 items-center justify-center rounded-[6px] border border-[#9C4DC1] p-2 pt-3"
                      >
                        <MediaFile
                          onRemove={() => onRemove(index)}
                          file={file}
                          preview={true}
                          contentWidth={109}
                          contentHeight={83}
                          className={classNames(
                            file.type.startsWith("image/")
                              ? "cursor-pointer rounded-[6px] object-contain"
                              : file.type.startsWith("video/")
                              ? "absolute inset-0 m-auto max-h-full min-h-full min-w-full max-w-full cursor-pointer rounded-[6px] object-cover"
                              : file.type.startsWith("aduio/")
                              ? "absolute inset-0 m-auto min-w-full max-w-full cursor-pointer rounded-[6px] object-cover"
                              : null
                          )}
                        />
                      </div>
                    ))}
                  </div>

                  {(files.length > 0 || contentIds.length > 0) && (
                    <FormInput
                      register={register}
                      name="drag-drop"
                      type="file"
                      multiple={true}
                      trigger={
                        <div className="box-border flex h-[110px] w-[127px]  items-center justify-center rounded-[8px] border-[1px] border-dashed border-passes-secondary-color bg-passes-secondary-color/10">
                          <PlusIcon />
                        </div>
                      }
                      options={{ onChange: onFileInputChange }}
                      accept={[
                        ".png",
                        ".jpg",
                        ".jpeg",
                        ".mp4",
                        ".mov",
                        ".qt",
                        ".mp3"
                      ]}
                      errors={errors}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {isCreator && (
          <div className="flex w-full items-center justify-between">
            <MediaHeader
              messages={true}
              activeMediaHeader={activeMediaHeader}
              register={register}
              errors={errors}
              onChange={onMediaHeaderChange}
              postTime={null}
            />
          </div>
        )}
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
        <>
          {hasVault && (
            <MessagesVaultDialog
              hasVault={hasVault}
              setHasVault={setHasVault}
              setContentIds={setContentIds}
            />
          )}
        </>
      </div>
    </form>
  )
}
