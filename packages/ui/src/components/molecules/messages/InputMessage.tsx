import { MessagesApi } from "@passes/api-client/apis"
import classNames from "classnames"
import React, { KeyboardEvent } from "react"
import { useForm } from "react-hook-form"
import { Button, ButtonTypeEnum } from "src/components/atoms"

interface Props {
  channelId?: string
}
export const InputMessage = ({ channelId }: Props) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm()
  const api = new MessagesApi()

  // TODO: error validation
  const submitMessage = async ({ message }: any) => {
    console.log("submit")

    if (!channelId) {
      return false
    }

    await api.sendMessage({
      sendMessageRequestDto: {
        text: message,
        contentIds: [],
        channelId,
        tipAmount: 0,
        payinMethod: {
          method: "none",
          cardId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          chainId: 0,
          chain: "eth"
        }
      }
    })

    reset()
  }

  const submitOnEnter = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.which === 13 && !event.shiftKey) {
      event.preventDefault()
      handleSubmit(submitMessage)()
    }
  }

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
      />
      <Button
        variant="gray"
        type={ButtonTypeEnum.SUBMIT}
        className="m-3 p-2"
        tag="button"
      >
        Send message
      </Button>
    </form>
  )
}
