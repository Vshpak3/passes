import { MessagesApi } from "@passes/api-client/apis"
import classNames from "classnames"
import PlusIcon from "public/icons/post-plus-icon.svg"
import { FC, KeyboardEvent, useState } from "react"
import { useForm } from "react-hook-form"
import { FormInput } from "src/components/atoms/FormInput"
// import { MessagePriceAlert } from "src/components/atoms/MessagePriceAlert"
// import { PostScheduleAlert } from "src/components/atoms/PostScheduleAlert"
import { MessagesVaultDialog } from "src/components/molecules/direct-messages/messages-vault-dialog"
import {
  Media,
  MediaFile
} from "src/components/organisms/profile/main-content/new-post/Media"
import { MediaHeader } from "src/components/organisms/profile/main-content/new-post/MediaHeader"
import { ACCEPTED_MEDIA_TYPES } from "src/components/organisms/profile/main-content/new-post/NewPostMediaSection"
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
    formState: { errors },
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
  // const [scheduled, setScheduled] = useState<any>()
  const [postPrice, setPostPrice] = useState<number>(0)
  const [loading, setLoading] = useState(false)
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

  const handleChange = (event: any) => {
    const limit = 5
    setPostPrice(event.target.value.slice(0, limit))
  }
  const preventMinus = (e: any) => {
    if (e.code === "Minus") {
      e.preventDefault()
    }
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
  // const handleRemoveScheduledMessageTime = () => {
  //   setScheduled(null)
  // }

  const submitMessage = async ({ message }: any) => {
    if (!channelId) {
      return false
    }
    setLoading(true)
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
    try {
      await api.sendMessage({
        sendMessageRequestDto: {
          text: message,
          contentIds: contentIdsToUpload,
          channelId,
          tipAmount: 0,
          price: postPrice,
          previewIndex: 0 // TODO: add previewing FE
        }
      })
      setLoading(false)
      setFiles([])
      setPostPrice(0)
      setContentIds([])
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
  const options = {}
  return (
    <form
      className="flex flex-col  border-t border-[#fff]/10 p-5 pb-0"
      onSubmit={handleSubmit(submitMessage)}
    >
      <div className="flex min-h-[37px] items-center justify-start gap-4">
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
              onKeyPress={preventMinus}
              min="0"
              max="9999"
              onChange={(event) => handleChange(event)}
              className="min-w-[121px] max-w-[121px] rounded-md border-passes-dark-200 bg-[#100C11] py-1 pr-4 text-right text-[14px] font-bold leading-[25px] text-[#ffffff]/90  focus:border-passes-dark-200 focus:ring-0"
            />
          </div>
        ) : null}
      </div>
      {/* <div className="flex w-full  items-center justify-end gap-3">
        {scheduled && (
          <div className="-mt-3 flex items-center justify-end">
            <PostScheduleAlert
              scheduledPostTime={scheduled}
              onRemoveScheduledPostTime={handleRemoveScheduledMessageTime}
            />
          </div>
        )}
      </div> */}
      {/* TODO: Schedule will be added on the future */}
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
                  accept={ACCEPTED_MEDIA_TYPES}
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
          "w-full resize-none border-x-0 border-b border-t-0 bg-black pb-5 pt-3 pl-0 focus:border-b-passes-primary-color focus:ring-0"
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
