import classNames from "classnames"
import React from "react"

interface ISendMessageButton {
  submit: () => void
  blocked?: boolean
  submitting?: boolean
  loading: boolean
  isCreator: boolean
  blockSendMessage: boolean
  tip?: number
}

export const SendMessageButton = ({
  submit,
  loading,
  isCreator,
  blockSendMessage,
  tip = 0
}: ISendMessageButton) => {
  return (
    <>
      {isCreator ? (
        <div
          className="messaging-input__button"
          role="button"
          aria-roledescription="button"
        >
          <button
            onClick={() => {
              submit()
            }}
            // {...(blocked || submitting ? { disabled: true } : {})}
            disabled={blockSendMessage}
            className="cursor-pointer gap-[10px] rounded-[50px] bg-passes-dark-200 px-[18px] py-[10px] text-white"
          >
            {loading ? "Sending.." : `Send message`}
          </button>
        </div>
      ) : (
        <div
          className="messaging-input__button w-full !p-0"
          role="button"
          aria-roledescription="button"
        >
          <button
            disabled={blockSendMessage}
            onClick={() => {
              submit()
            }}
            className={classNames(
              blockSendMessage ? " cursor-not-allowed opacity-50" : "",
              "w-full cursor-pointer items-center justify-center bg-passes-secondary-color py-4 text-center text-[16px] leading-[25px] text-white"
            )}
          >
            {loading
              ? "Sending..."
              : tip > 0
              ? " Send Message with Tip"
              : ` Send Message`}
          </button>
        </div>
      )}
    </>
  )
}
