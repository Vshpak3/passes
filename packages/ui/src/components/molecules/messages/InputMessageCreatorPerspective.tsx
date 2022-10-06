import { MessagesApi } from "@passes/api-client/apis"
import classNames from "classnames"
import DeleteIcon from "public/icons/post-audience-x-icon.svg"
// import PlusIcon from "public/icons/post-plus-icon.svg"
import { FC, KeyboardEvent, useState } from "react"
import { useForm } from "react-hook-form"
import { FormInput } from "src/components/atoms"
import { MessagesVaultDialog } from "src/components/molecules/direct-messages/messages-vault-dialog"
import { Dialog } from "src/components/organisms"
import MediaHeader from "src/components/organisms/profile/main-content/new-post/header"
import { formatCurrency } from "src/helpers"
const MB = 1048576
const MAX_FILE_SIZE = 10 * MB
const MAX_FILES = 9

interface InputMessageProps {
  channelId?: string
}

export const InputMessageCreatorPerspective: FC<InputMessageProps> = ({
  channelId
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
  // TODO: Deal with contentIds coming from vault
  const [activeMediaHeader, setActiveMediaHeader] = useState("Media")
  const [hasVault, setHasVault] = useState(false)
  const [hasPrice, setHasPrice] = useState(false)
  // const [scheduled, setScheduled] = useState()
  // TODO: Add schedule to the  messages

  // const [attachments, setAttachments] = useState([])
  // TODO: Deal with attachements
  const [targetAcquired, setTargetAcquired] = useState(false)
  // const payinMethod = undefined
  const [loading, setLoading] = useState(false)
  const postPrice = watch("postPrice")

  const onMediaHeaderChange = (event: any) => {
    if (typeof event === "object") {
      // setScheduled(event)
      setContentIds(contentIds)
      // dummy line
      return
    }
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

  // const onRemove = (index: any) => {
  //   setFiles(files.filter((_: any, i: any) => i !== index))
  // }
  // TODO: Add ability to remove content

  const submitMessage = async ({ message }: any) => {
    if (!channelId) {
      return false
    }
    setLoading(true)
    try {
      await api.sendMessage({
        sendMessageRequestDto: {
          text: message,
          contentIds: [],
          channelId,
          tipAmount: 0
        }
      })
      setLoading(false)
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
      {targetAcquired && (
        <div
          className="flex w-full cursor-pointer items-center justify-end gap-2"
          onClick={() => setTargetAcquired(!targetAcquired)}
        >
          <span className="text-base font-medium text-[#ffff]">
            Post Price {formatCurrency(postPrice)}
          </span>

          <DeleteIcon className="" onClick={() => onDeletePostPrice()} />
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
