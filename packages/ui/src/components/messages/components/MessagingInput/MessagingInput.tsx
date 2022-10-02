// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { MessagesApi, PostApi } from "@passes/api-client/apis"
import DeleteIcon from "public/icons/post-audience-x-icon.svg"
import PlusIcon from "public/icons/post-plus-icon.svg"
import React, { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { FormInput } from "src/components/atoms"
import { GiphyContext } from "src/components/messages/index"
import { MessagesVaultDialog } from "src/components/molecules/direct-messages/messages-vault-dialog"
import { SendMessageButton } from "src/components/molecules/payment/send-message-button"
import { Dialog } from "src/components/organisms"
import MediaHeader from "src/components/organisms/profile/main-content/new-post/header"
import {
  Media,
  MediaFile
} from "src/components/organisms/profile/main-content/new-post/media"
import { classNames, ContentService, formatCurrency } from "src/helpers"
import { useChat } from "src/hooks"
import { usePay } from "src/hooks/usePay"
import { ChatContext, useChatContext } from "stream-chat-react"
import { useSWRConfig } from "swr"

const MB = 1048576
const MAX_FILE_SIZE = 10 * MB
const MAX_FILES = 9

const MessagingInput = () => {
  const { isCreator, files, setFiles, user } = useContext(GiphyContext)
  const { channel: activeChannel, client } = useChatContext(ChatContext)
  const [contentIds, setContentIds] = useState([])
  const members = Object.values(activeChannel?.state?.members).filter(
    ({ user }) => user?.id !== client.userID
  )
  const { channelId } = useChat(members[0]?.user.name)
  const [activeMediaHeader, setActiveMediaHeader] = useState("Media")
  const [hasVault, setHasVault] = useState(false)
  const [hasPrice, setHasPrice] = useState(false)
  const [attachments, setAttachments] = useState([])
  const [targetAcquired, setTargetAcquired] = useState(false)
  const { mutate } = useSWRConfig()

  const {
    register,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: {}
  })
  const postPrice = watch("postPrice")
  const text = watch("text")

  const payinMethod = undefined
  const api = new MessagesApi()

  const onSubmit = async () => {
    if (text?.length < 1) {
      return null
    }
    if (files.length > 0 || contentIds.length > 0) {
      await onSubmitWithAttachment()
      if (isCreator && files.length > 0) {
        await submitData()
        await submit()
        setValue("text", "", { shouldValidate: true })
      } else {
        submit()
      }
    } else {
      submit()
    }
  }

  const onSubmitWithAttachment = async () => {
    const content = await new ContentService().uploadContent(files)
    const uploadedContentIds = content.map((c: any) => c.id)
    const { postId } = await createPost({
      contentIds: [...contentIds, ...uploadedContentIds]
    })
    const uploadedAttachment = [postId]
    setAttachments(uploadedAttachment)
    setFiles([])
    setValue("postPrice", "", { shouldValidate: true })
    setTargetAcquired(!targetAcquired)
    // reset()
  }

  const createPost = async ({ contentIds }: any) => {
    const api = new PostApi()
    const result = await mutate(
      [`/post/creator/`, user?.username],
      async () =>
        await api.createPost({
          createPostRequestDto: {
            price: targetAcquired ? parseInt(postPrice) : 0,
            contentIds,
            passIds: [],
            tags: [],
            text
          }
        }),
      {
        populateCache: (post, previousPosts) => {
          if (!previousPosts) {
            return {
              count: 1,
              cursor: user?.username,
              posts: [post]
            }
          } else {
            return {
              count: previousPosts.count + 1,
              cursor: previousPosts.cursor,
              posts: [post, ...previousPosts.posts]
            }
          }
        },
        // Since the API already gives us the updated information,
        // we don't need to revalidate here.
        revalidate: false
      }
    )
    return result.posts[0]
  }

  const registerMessage = async () => {
    return await api.sendMessage({
      sendMessageRequestDto: {
        text,
        attachments,
        otherUserId: members[0]?.user.id,
        channelId,
        tipAmount: 0,
        payinMethod
      }
    })
  }

  const registerMessageData = async () => {
    return await api.sendMessageData({
      sendMessageRequestDto: {
        text,
        attachments,
        otherUserId: members[0]?.user.id,
        channelId,
        tipAmount: 0,
        payinMethod
      }
    })
  }

  const onCallback = (error: any) => {
    if (!error) {
      setValue("text", "", { shouldValidate: true })
    }
  }

  const { blocked, amountUSD, submitting, loading, submit, submitData } =
    usePay(registerMessage, registerMessageData, onCallback)

  const onMediaHeaderChange = (event: any) => {
    if (typeof event !== "string") {
      return onFileInputChange(event)
    }
    switch (event) {
      case "Vault":
        setHasVault(true)
        break
      case "Message Price":
        setHasPrice(true)
        break
      default:
        setActiveMediaHeader(event)
        break
    }
  }

  const onTargetAcquired = () => {
    setHasPrice(false)
    setTargetAcquired(true)
  }

  const onDeletePostPrice = () => {
    setHasPrice(false)
    setTargetAcquired(false)
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
  const onTextChange = (_event: any, keyDownEvent: any) => {
    if (keyDownEvent.code === "Enter" && !keyDownEvent.shiftKey) {
      onSubmit()
      setValue("text", "", { shouldValidate: true })
    }
  }
  const onRemove = (index: any) => {
    setFiles(files.filter((_: any, i: any) => i !== index))
  }

  return (
    <div>
      <style>{`
        .str-chat__messaging-input {
          background: #ffffff;
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: start;
          padding: 10px 20px 0px 20px;
          position: relative;
          display:flex;
          flex-direction:column;
          justify-content:flex-start;

        }

        .str-chat.dark .str-chat__messaging-input {
          background: #000;
          border-top: 1px solid rgba(255, 255, 255, 0.15);
        }

        .messaging-input__container {
          display: flex;
          justify-content:flex-start;
          align-items: start;
          width:100%;
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
          margin-left: 8px;
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
          opacity: 0.8;
          cursor: pointer;
          padding: 0 4px;
          transition: opacity 0.2s ease-in-out;
        }

        .messaging-input__button svg path {
          transition: fill 0.2s ease-in-out;
          fill: black;
        }

        .messaging-input__button:hover {
          opacity: 1;
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
      <div className="str-chat__messaging-input">
        {targetAcquired && (
          <div
            className="flex w-full cursor-pointer items-center justify-end gap-2"
            onClick={() => setTargetAcquired(!targetAcquired)}
          >
            <span className="text-base font-medium  text-[#ffff]">
              Post Price {formatCurrency(postPrice)}
            </span>

            <DeleteIcon className="" onClick={() => onDeletePostPrice()} />
          </div>
        )}
        {(files.length > 0 || contentIds.length > 0) && (
          <div className="h-full w-full items-center overflow-y-auto pt-1">
            <div className="flex w-full flex-col items-start justify-start gap-6 overflow-hidden rounded-lg border-[1px] border-solid border-transparent p-1">
              <div className="flex items-center justify-start gap-6">
                <div className="flex max-w-[190px] flex-nowrap items-center gap-6 overflow-x-auto md:max-w-[550px]">
                  {contentIds.map((contentId, index) => (
                    <div
                      key={index}
                      className="relative flex h-[66px] w-[79px] flex-shrink-0 items-center justify-center rounded-[6px]"
                    >
                      <Media
                        onRemove={() => onRemove(index)}
                        src={`${process.env.NEXT_PUBLIC_CDN_URL}/media/${user?.id}/${contentId}.jpeg`}
                        // className="cursor-pointer rounded-[6px] object-contain"
                        type="image"
                        // TODO:this logic should be done on backend
                      />
                    </div>
                  ))}
                  {files.map((file: any, index: any) => (
                    <div
                      key={index}
                      className="relative flex h-[66px] w-[79px] flex-shrink-0 items-center justify-center rounded-[6px]"
                    >
                      <MediaFile
                        onRemove={() => onRemove(index)}
                        file={file}
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
                      <div className="box-border flex h-[66px] w-[79px]  items-center justify-center rounded-[6px] border-[1px] border-dashed border-passes-secondary-color bg-passes-secondary-color/10">
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
        <div className="w-full">
          <div className="messaging-input__container">
            {/* <div
              className="messaging-input__button emoji-button"
              role="button"
              aria-roledescription="button"
              onClick={messageInput.openEmojiPicker}
              ref={messageInput.emojiPickerRef}
            >
              <div className="pt-[9px]">
                <EmojiIcon />
              </div>
            </div> */}
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

        <div className="flex w-full items-center justify-between border-t border-passes-dark-200 py-1 pr-5">
          <div>
            <MediaHeader
              messages={true}
              activeMediaHeader={activeMediaHeader}
              register={register}
              errors={errors}
              onChange={onMediaHeaderChange}
            />
          </div>
          <div>
            {channelId && (
              <SendMessageButton
                submit={onSubmit}
                blocked={blocked}
                submitting={submitting}
                loading={loading}
                amountUSD={amountUSD}
                isCreator={isCreator}
                blockSendMessage={text?.length < 1}
              />
            )}
          </div>
        </div>
      </div>
      <>
        {hasPrice && (
          <Dialog
            className="flex w-screen transform flex-col items-center justify-center border border-[#ffffff]/10 bg-[#0c0609] px-[29px] py-5 transition-all md:max-w-[544px] md:rounded-[20px]"
            open={true}
            title={
              <div>
                <div className="relative h-full">
                  <div className="flex flex-col items-start justify-start gap-3">
                    <div>POST PRICE</div>
                    <div className="flex w-full items-center justify-center rounded-md shadow-sm">
                      <FormInput
                        autoComplete="off"
                        register={register}
                        type="text"
                        name="postPrice"
                        placeholder={"Minimum $3 USD or free"}
                        className="w-full rounded-md border-passes-dark-200 bg-[#100C11]  pl-4 text-base font-bold text-[#ffffff]/90 focus:border-passes-dark-200 focus:ring-0 "
                      />
                    </div>
                    <div className="flex w-full items-end justify-end gap-3">
                      <button
                        className="rounded-full bg-passes-secondary-color py-2 px-6"
                        type="button"
                        onClick={() => onTargetAcquired()}
                      >
                        Cancel
                      </button>
                      <button
                        className={classNames(
                          !(postPrice > 10) ? "opacity-50" : "",
                          "rounded-full bg-passes-secondary-color py-2 px-6"
                        )}
                        type="button"
                        onClick={() => onTargetAcquired()}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          ></Dialog>
        )}
        {hasVault && (
          <MessagesVaultDialog
            hasVault={hasVault}
            setHasVault={setHasVault}
            setContentIds={setContentIds}
          />
        )}
      </>
    </div>
  )
}

export default React.memo(MessagingInput)
