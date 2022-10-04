import { MessagesApi } from "@passes/api-client/apis"
import classNames from "classnames"
import { FC, KeyboardEvent } from "react"
import { useForm } from "react-hook-form"
import { Button, ButtonTypeEnum } from "src/components/atoms"

interface InputMessageProps {
  channelId?: string
}

export const InputMessage: FC<InputMessageProps> = ({ channelId }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
    clearErrors
  } = useForm()
  const api = new MessagesApi()

  const submitMessage = async ({ message }: any) => {
    if (!channelId) {
      return false
    }

    try {
      await api.sendMessage({
        sendMessageRequestDto: {
          text: message,
          contentIds: [],
          channelId,
          tipAmount: 0
        }
      })

      reset()
    } catch (error) {
      setError("submitError", {
        type: "custom",
        message: "There was an error sending the message"
      })
    }
  }

  const submitOnEnter = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSubmit(submitMessage)()
    }
  }
  const { submitError } = errors

  return (
    <form
      className="flex flex-col items-end border-t border-gray-800 p-6"
      onSubmit={handleSubmit(submitMessage)}
    >
      <textarea
        {...register("message", { required: true })}
        className={classNames(
          errors.message && "border-b-red",
          "mb-2 w-full resize-none border-x-0 border-b border-t-0 bg-black focus:border-b-passes-primary-color focus:ring-0"
        )}
        autoComplete="off"
        onKeyDown={submitOnEnter}
        onFocus={() => {
          clearErrors()
        }}
      />
      <Button
        variant="gray"
        type={ButtonTypeEnum.SUBMIT}
        className="m-3 p-2"
        tag="button"
      >
        Send message
      </Button>
      {submitError?.message && (
        <span className="text-red-500">{String(submitError.message)}</span>
      )}
    </form>
  )
}
