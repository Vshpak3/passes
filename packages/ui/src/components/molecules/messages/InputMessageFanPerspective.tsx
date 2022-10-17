import { PayinDataDtoBlockedEnum } from "@passes/api-client"
import { MessagesApi } from "@passes/api-client/apis"
import classNames from "classnames"
import { debounce } from "lodash"
import React, {
  FC,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState
} from "react"
import { useForm } from "react-hook-form"
import { usePay } from "src/hooks/usePay"

interface Props {
  channelId: string
  minimumTip?: number | null
}

const api = new MessagesApi()
export const InputMessageFanPerspective: FC<Props> = ({
  channelId,
  minimumTip
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

  const registerMessage = async () => {
    return await api.sendMessage({
      sendMessageRequestDto: {
        text: message,
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
      submit()
      reset()
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
    undefined,
    onCallback
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeTip = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setTip(parseFloat(parseFloat(value).toFixed(2)))
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
        await submitData(async () =>
          api.sendMessageData({
            sendMessageRequestDto: {
              text: "message",
              contentIds: [],
              channelId,
              tipAmount: tip,
              previewIndex: 0
            }
          })
        )
      }
      fetch()
    }
  }, [channelId, message, submitData, tip])

  return (
    <form
      className="grid w-full grid-cols-3 border-t border-[#fff]/10"
      onSubmit={handleSubmit(submitMessage)}
    >
      <div className=" order-2 col-span-3 sm:order-1 sm:col-span-2">
        <div className="flex h-fit w-full items-start justify-start px-7 py-8">
          <textarea
            placeholder="Send a message.."
            rows={4}
            cols={40}
            {...register("message", { required: true })}
            className={classNames(
              errors.message && "border-b-red",
              "w-full resize-none border-transparent bg-transparent p-2 text-[#ffffff]/90 focus:border-transparent focus:ring-0 md:m-0 md:p-0"
            )}
            autoComplete="off"
            onKeyDown={submitOnEnter}
            onFocus={() => {
              clearErrors()
            }}
          />
        </div>
      </div>
      <div className="order-1 col-span-3 h-full border-l border-gray-800 sm:order-2 sm:col-span-1">
        <div className=" flex h-full flex-col justify-between sm:items-center sm:justify-center">
          <div className="flex h-full flex-row items-start justify-between sm:flex-col sm:items-center sm:justify-center sm:py-4">
            <input
              type="number"
              placeholder="0.00"
              // value={tip}
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
