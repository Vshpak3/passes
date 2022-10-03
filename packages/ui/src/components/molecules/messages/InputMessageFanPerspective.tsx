import { MessagesApi } from "@passes/api-client/apis"
import classNames from "classnames"
import React, { KeyboardEvent, useState } from "react"
import { useForm } from "react-hook-form"
import { useDebouncedEffect } from "src/components/messages/utils/useDebounceEffect"
import { usePay } from "src/hooks/usePay"

interface Props {
  channelId: string
}
export const InputMessageFanPerspective = ({ channelId }: Props) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    clearErrors,
    reset,
    watch
  } = useForm()
  const api = new MessagesApi()
  const [tip, setTip] = useState(0)
  const message = watch("message")
  const payinMethod = undefined
  // TODO: error validation
  // const [loading, setLoading] = useState(false)
  // const [blocked, setBlocked] = useState(false)
  // TODO: loading and blocked should be used from usePay along with blocked enums, next step

  const registerMessage = async () => {
    return await api.sendMessage({
      sendMessageRequestDto: {
        text: message,
        contentIds: [],
        channelId,
        tipAmount: tip,
        payinMethod
      }
    })
  }

  const registerMessageData = async () => {
    return await api.sendMessageData({
      sendMessageRequestDto: {
        text: "test",
        contentIds: [],
        channelId,
        tipAmount: tip,
        payinMethod
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
      console.log(error, "message error")
      setError("submitError", {
        type: "custom",
        message: "There was an error sending the message"
      })
    }
  }

  // TODO: sendMessageData
  // TODO: Dealing with certain BlockedReasonEnum
  const onCallback = (error: any) => {
    if (!error) {
      // setValue("text", "", { shouldValidate: true })
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

  useDebouncedEffect(
    () => {
      if (channelId && tip !== null) {
        console.log("rendered TIP")
        submitData()
      }
    },
    [channelId, tip],
    20
  )

  return (
    <form
      className="grid w-full grid-cols-3 border-t border-gray-800"
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
              placeholder="$"
              value={tip}
              onChange={(e) => setTip(parseInt(e.target.value))}
              className={classNames(
                errors.message && "border-b-red",
                "sm:w-ful w-full items-center justify-center border-none bg-transparent p-0 text-center text-[42px] font-bold leading-[53px] text-passes-secondary-color placeholder-purple-300 outline-0 ring-0 focus:outline-0 focus:ring-0"
              )}
              autoComplete="off"
              min="0"
            />

            <span className="flex h-full w-full items-center justify-center text-[14px] leading-[24px] text-[#ffff]/50">
              minimum $5 tip
            </span>
          </div>
          <div
            className="messaging-input__button w-full !p-0"
            role="button"
            aria-roledescription="button"
          >
            <button
              type="button"
              disabled={false}
              className={classNames(
                // TODO: enum BlockedReasonEnum
                blocked ? " cursor-not-allowed opacity-50" : "",
                "w-full cursor-pointer items-center justify-center bg-passes-secondary-color py-4 text-center text-[16px] leading-[25px] text-white"
              )}
            >
              {submitting
                ? // //: TODO enum BlockedReasonEnum
                  "Sending..."
                : tip > 0
                ? " Send Message with Tip"
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
    </form>
  )
}
