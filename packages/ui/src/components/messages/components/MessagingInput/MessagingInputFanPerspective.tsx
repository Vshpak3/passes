// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { MessagesApi } from "@passes/api-client/apis"
import React, { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import { FormInput } from "src/components/atoms"
import { GiphyContext } from "src/components/messages"
import { SendMessageButton } from "src/components/molecules/payment/send-message-button"
import { useChat } from "src/hooks"
import { usePay } from "src/hooks/usePay"
import { ChatContext, useChatContext } from "stream-chat-react"

const MessagingInputFanPerspective = () => {
  const { freeMessages, setFreeMessages } = useContext(GiphyContext)
  const { channel: activeChannel, client } = useChatContext(ChatContext)
  // const [openBuyMessagesModal, setOpenBuyMessagesModal] = useState(false)

  const members = Object.values(activeChannel?.state?.members).filter(
    ({ user }) => user?.id !== client.userID
  )
  const { channelId } = useChat(members[0]?.user.name)
  const { register, setValue, watch } = useForm()
  const text = watch("text")
  const tip = watch("tipAmount")
  const payinMethod = undefined
  const api = new MessagesApi()
  // On initiate call submitData to check for tip, also a useffect when tip changes check first submitData
  // make sure to have button disabled when checking submit data tip

  useEffect(() => {
    if (channelId) {
      submitData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId])

  const onSubmit = async () => {
    if (text?.length > 0 && freeMessages !== 0) {
      submit()
      setValue("text", "", { shouldValidate: true })
    } else if (text?.length < 1 || (freeMessages === 0 && tip < 6)) {
      return null
    }
  }

  const registerMessage = async () => {
    return await api.sendMessage({
      sendMessageRequestDto: {
        text,
        attachments: [],
        channelId,
        otherUserId: members[0]?.user.id,
        tipAmount: tip === null ? 0 : tip === "" ? 0 : parseInt(tip),
        payinMethod
      }
    })
  }

  const registerMessageData = async () => {
    return await api.sendMessageData({
      sendMessageRequestDto: {
        text: "test",
        otherUserId: members[0]?.user.id,
        attachments: [],
        channelId,
        tipAmount: tip === null ? 0 : tip === "" ? 0 : parseInt(tip),
        payinMethod
      }
    })
  }

  const onCallback = (error: any) => {
    if (!error) {
      setValue("text", "", { shouldValidate: true })
      setFreeMessages(freeMessages > 0 ? freeMessages - 1 : 0)
    }
  }
  const { blocked, submitting, loading, submit, submitData } = usePay(
    registerMessage,
    registerMessageData,
    onCallback
  )
  const onTextChange = (_event: any, keyDownEvent: any) => {
    if (keyDownEvent.code === "Enter" && !keyDownEvent.shiftKey) {
      onSubmit()
    }
  }
  return (
    <div>
      <style>{`
        .str-chat__messaging-input {
          background: #ffffff;
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.08);
          align-items: start;
          position: relative;
          justify-content:flex-start;
          height:100%;
        }

        .str-chat.dark .str-chat__messaging-input {
          background: #000;
          border-top: 1px solid rgba(255, 255, 255, 0.15);
        }

        .messaging-input__container {
          display: flex;
          justify-content:center;
          align-items: center;
          width:100%;
          padding:10px;
          display: flex;
          height: 100%;
        }

        .messaging-input__input-wrapper {
          display: flex;
          justify-content: flex-start;
          align-items: start;
          width: 100%;
          min-height: 100px;
          height: fit-content;
          z-index: 100;
          background: transparent;
          border: none;
          position: relative;
        }

        .str-chat.dark .messaging-input__input-wrapper {
          border: none;
          background: transparent;
        }

        .str-chat__messaging-input .messaging-input__input-wrapper:focus-within {
          border: transparent;
        }

        .str-chat__messaging-input > *:not(:first-of-type) {
        }

        .str-chat__textarea {
          display: flex;
          align-items: start;
          height:100%
        }

        .str-chat__textarea textarea {
          background: #ffffff;
          font-size: 14px;
          line-height: 16px;
          min-height: 0;
          transition: box-shadow 0.2s ease-in-out;
          color: rgba(0, 0, 0, 0.9);
          border: none !important;
          outline: none !important;
          border-radius: 20px;
          padding: 11px;
          height:100%;
        }

        .str-chat.dark .str-chat__messaging-input .str-chat__textarea textarea {
          background: transparent;
          border: 1px solid rgba(0, 0, 0, 0.16);
          color: rgba(255, 255, 255, 0.9);
          min-height:100px;

        }

        .str-chat__textarea textarea:focus {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          height:100%;

        }

        .messaging-input__button {
          opacity: 1;
          cursor: pointer;
          padding: 0 4px;
          display:flex;
          justify-content:flex-end;
          padding-bottom:10px;
        }

        .messaging-input__button svg path {
          transition: fill 0.2s ease-in-out;
          fill: black;
        }


        .messaging-input__button:hover svg path {
          fill: #BF7AF0 !important;
        }

        .str-chat__input--emojipicker {
          z-index: 100;
          left: 36px;
        }

        .str-chat__thread .str-chat__input--emojipicker {
          position: fixed;
          top: 25% !important;
          right: 330px;
          left: auto;
        }

        .str-chat__messaging-input .emoji-mart-bar,
        .str-chat__messaging-input .emoji-mart-search input {
          border-color: rgba(0, 0, 0, 0.36);
        }

        .str-chat.dark .str-chat__messaging-input .messaging-input__button svg path {
          fill: white;
        }

        .giphy-icon__wrapper {
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          height: 24px;
          width: 63px;
          background: #005fff;
          border-radius: 12px;
          margin-left: 8px;
        }

        .giphy-icon__text {
          font-family: Helvetica Neue, sans-serif;
          font-weight: bold;
          font-size: 11px;
          line-height: 8px;
          color: #ffffff;
        }

        div.rfu-dropzone {
          width: 100%;
        }

        div.rfu-dropzone:focus {
          outline: none;
        }

        .rfu-image-previewer {
          flex: none;
          margin-left: 12px;
        }

        .rfu-image-previewer__image {
          margin-bottom: 0;
        }

        div.rta__autocomplete.str-chat__emojisearch {
          z-index: 10;
          position: absolute;
          width: 30%;
          background: #fafafa;
          margin: 4px 10px;
          border-radius: 16px !important;
        }

        .str-chat__thread div.rta__autocomplete.str-chat__emojisearch {
          width: 100%;
          left: -10px;
        }

        .str-chat__user-item {
          background: #ffffff;
          color: #000000;
        }

        .str-chat.dark .str-chat__user-item {
          background: rgba(46, 48, 51, 0.98);
          color: #ffffff;
        }

        .str-chat__user-item:hover {
          background: #005fff !important;
          color: #ffffff;
          cursor: pointer;
        }

        .rta__entity--selected {
          background: #005fff;
        }

        .str-chat__slash-command:hover {
          background: #005fff;
          cursor: pointer;
        }

        .rta__list-header {
          font-family: Helvetica Neue, sans-serif;
          font-size: 14px;
          line-height: 16px;
          color: rgba(0, 0, 0, 0.9);
          mix-blend-mode: normal;
        }

        @media screen and (max-width: 640px) {
          div.rta__autocomplete.str-chat__emojisearch {
            width: unset;
          }

          .str-chat__textarea textarea {
            font-size: 16px;
          }
        }
        `}</style>
      <div className="str-chat__messaging-input flex flex-col-reverse sm:flex sm:flex-row">
        <div className="flex h-full w-full flex-col justify-between">
          <div className="messaging-input__container">
            <div className="messaging-input__container">
              <div className="messaging-input__input-wrapper">
                <FormInput
                  register={register}
                  type="text-area"
                  name="text"
                  className="w-full resize-none border-transparent bg-transparent p-2 text-[#ffffff]/90 focus:border-transparent focus:ring-0 md:m-0 md:p-0"
                  placeholder="Send a message.."
                  rows={4}
                  cols={40}
                  options={{ onChange: onTextChange }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="border-l-none flex flex-col justify-between border-t border-passes-dark-200 sm:max-w-[254px] sm:items-center sm:justify-center sm:border-t-0 sm:border-l">
          <div className="flex flex-row items-start justify-between sm:flex-col sm:items-center sm:justify-center sm:py-4 ">
            <FormInput
              register={register}
              type="number"
              name="tipAmount"
              placeholder="$"
              min="0"
              className="w-full items-center justify-center border-none bg-transparent p-0 text-center text-[42px] font-bold leading-[53px] text-passes-secondary-color placeholder-purple-300 outline-0 ring-0 focus:outline-0 focus:ring-0 sm:w-full"
            />
            <span className="flex h-full w-full items-center justify-center text-[14px] leading-[24px] text-[#ffff]/50">
              minimum $5 tip
            </span>
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
          </div>
          {channelId && (
            <SendMessageButton
              blockSendMessage={
                (freeMessages === 0 && tip < 5) || text?.length < 1
              }
              submit={onSubmit}
              blocked={blocked}
              submitting={submitting}
              loading={loading}
              isCreator={false}
              tip={tip}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default React.memo(MessagingInputFanPerspective)
