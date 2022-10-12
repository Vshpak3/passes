import { MessagesApi } from "@passes/api-client/apis"
import classNames from "classnames"
import PlusIcon from "public/icons/post-plus-icon.svg"
import { FC, KeyboardEvent, useState } from "react"
import { useForm } from "react-hook-form"
import { FormInput } from "src/components/atoms/FormInput"
import { MessagePriceAlert } from "src/components/atoms/MessagePriceAlert"
import { PostScheduleAlert } from "src/components/atoms/PostScheduleAlert"
import { MessagesVaultDialog } from "src/components/molecules/direct-messages/messages-vault-dialog"
import { Dialog } from "src/components/organisms/Dialog"
import { MediaHeader } from "src/components/organisms/profile/main-content/new-post/header"
import {
  Media,
  MediaFile
} from "src/components/organisms/profile/main-content/new-post/media"
import { ContentService } from "src/helpers/content"
const MB = 1048576
const MAX_FILE_SIZE = 10 * MB
const MAX_FILES = 9

interface InputMessageProps {
  channelId?: string
  user: any
}

export const InputMessageCreatorPerspective: FC<InputMessageProps> = ({
  channelId,
  user
}) => {
  const {
    register,
    formState: {
      errors
      // isSubmitSuccessful TODO: recheck this
    },
    handleSubmit,
    reset,
    setError,
    clearErrors,
    watch
  } = useForm()
  const api = new MessagesApi()
  const [files, setFiles] = useState<any[]>([])
  const [contentIds, setContentIds] = useState<any[]>([])
  const [activeMediaHeader, setActiveMediaHeader] = useState("Media")
  const [hasVault, setHasVault] = useState(false)
  const [hasPrice, setHasPrice] = useState(false)
  const [scheduled, setScheduled] = useState<any>()

  const [targetAcquired, setTargetAcquired] = useState(false)
  const [loading, setLoading] = useState(false)
  const postPrice = watch("postPrice")

  const onMediaHeaderChange = (prop: any) => {
    if (Object.prototype.toString.call(prop) === "[object Date]") {
      setScheduled(prop)
      return
    }

    if (prop?.target?.files.length > 0) {
      return onFileInputChange(prop)
    }
    switch (prop) {
      case "Vault":
        setHasVault(true)
        break
      case "Message Price":
        setHasPrice(true)
        break
      default:
        setActiveMediaHeader(prop)
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

  const onRemove = (index: any) => {
    setFiles(files.filter((_: any, i: any) => i !== index))
  }
  const handleRemoveScheduledMessageTime = () => {
    setScheduled(null)
  }

  const submitMessage = async ({ message }: any) => {
    if (!channelId) {
      return false
    }
    setLoading(true)
    let contentIdsToUpload: any[] = []
    if (files.length > 0) {
      const content = await new ContentService().uploadContent(files)
      const uploadedContentIds = content.map((c: any) => c.id)
      contentIdsToUpload = [...uploadedContentIds, ...contentIds]
    }
    if (contentIds.length > 0) {
      contentIdsToUpload = [...contentIds, ...contentIdsToUpload]
    }
    try {
      await api.sendMessage({
        sendMessageRequestDto: {
          text: message,
          contentIds: contentIdsToUpload,
          channelId,
          tipAmount: 0,
          price: postPrice == null ? 0 : parseInt(postPrice)
        }
      })
      setLoading(false)
      setFiles([])
      onDeletePostPrice()
      setContentIds([])
      setScheduled(false)
      reset()
    } catch (error) {
      setError("submitError", {
        type: "custom",
        message: "There was an error sending the message"
      })
    }
    setLoading(false)
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
      className="flex flex-col items-end border-t border-[#fff]/10 p-5 pb-0"
      onSubmit={handleSubmit(submitMessage)}
    >
      <div className="flex w-full  items-center justify-end gap-3">
        {targetAcquired && (
          <MessagePriceAlert
            price={postPrice}
            onRemovePrice={onDeletePostPrice}
          />
        )}
        {scheduled && (
          <div className="-mt-3 flex items-center justify-end">
            <PostScheduleAlert
              scheduledPostTime={scheduled}
              onRemoveScheduledPostTime={handleRemoveScheduledMessageTime}
            />
          </div>
        )}
      </div>

      {(files.length > 0 || contentIds.length > 0) && (
        <div className=" w-full items-center self-start overflow-y-auto pt-1">
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
      <textarea
        {...register("message", { required: true })}
        className={classNames(
          errors.message && "border-b-red",
          "w-full resize-none border-x-0 border-b border-t-0 bg-black py-5 focus:border-b-passes-primary-color focus:ring-0"
        )}
        autoComplete="off"
        onKeyDown={submitOnEnter}
        onFocus={() => {
          clearErrors()
        }}
      />
      <div className="flex w-full items-center justify-between py-5">
        <div>
          <MediaHeader
            messages={true}
            activeMediaHeader={activeMediaHeader}
            register={register}
            errors={errors}
            onChange={onMediaHeaderChange}
            postTime={null}
          />
        </div>
        <div
          className="cursor-pointer p-0 py-1 opacity-80 transition-opacity duration-1000  ease-out hover:opacity-100 "
          role="button"
          aria-roledescription="button"
        >
          <button className="cursor-pointer gap-[10px] rounded-[50px] bg-passes-dark-200 px-[18px] py-[10px] text-white">
            {loading ? "Sending.." : `Send message`}
          </button>
        </div>
        {submitError?.message && (
          <span className="text-red-500">{String(submitError.message)}</span>
        )}
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
    </form>
  )
}
