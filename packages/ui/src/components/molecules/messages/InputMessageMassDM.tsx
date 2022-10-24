import { ContentDto, ListDto, PassDto } from "@passes/api-client"
import { MessagesApi } from "@passes/api-client/apis"
import classNames from "classnames"
import React, {
  Dispatch,
  FC,
  KeyboardEvent,
  SetStateAction,
  useState
} from "react"
import { useForm } from "react-hook-form"
import { FormInput } from "src/components/atoms/FormInput"
import { VaultSelector } from "src/components/atoms/VaultSelector"
import { MediaSection } from "src/components/organisms/MediaSection"
import {
  MediaSelector,
  PhotoSelector,
  VideoSelector
} from "src/components/organisms/MediaSelector"
import { ContentService } from "src/helpers/content"
import { ContentFile, useMedia } from "src/hooks/useMedia"

interface Props {
  vaultContent: ContentDto[]
  setVaultContent: Dispatch<SetStateAction<ContentDto[]>>
  selectedPasses: PassDto[]
  setSelectedPasses: Dispatch<SetStateAction<PassDto[]>>
  selectedLists: ListDto[]
  setSelectedLists: Dispatch<SetStateAction<ListDto[]>>
  excludedLists: ListDto[]
  setExcludedLists: Dispatch<SetStateAction<ListDto[]>>
  setMassMessage: Dispatch<SetStateAction<any>>
}

export const InputMessageMassDM: FC<Props> = ({
  vaultContent,
  setVaultContent,
  selectedPasses,
  setSelectedPasses,
  selectedLists,
  setSelectedLists,
  excludedLists,
  setExcludedLists,
  setMassMessage
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    // setValue,
    setError,
    clearErrors,
    reset,
    watch
  } = useForm()
  const message = watch("message", "")
  const { files, setFiles, addNewMedia, onRemove, addContent } = useMedia(
    vaultContent.map((content) => new ContentFile(undefined, content))
  )
  const [activeMediaHeader, setActiveMediaHeader] = useState("Media")
  const [messagePrice, setMessagePrice] = useState<number>(0)
  const isPaid = watch("isPaid")

  const onMediaHeaderChange = (prop: any) => {
    setActiveMediaHeader("")
    if (prop?.target?.files.length > 0) {
      return onFileInputChange(prop)
    }
  }

  const onFileInputChange = (event: any) => {
    const files = [...event.target.files] as File[]
    addNewMedia(files)
    event.target.value = ""
  }

  const onSubmit = async () => {
    const messagesApi = new MessagesApi()
    const listIds = selectedLists.map((s) => s.listId)
    const passIds = selectedPasses.map((s) => s.passId)
    const excludedIds = excludedLists.map((s) => s.listId)

    const contentIds = await new ContentService().uploadContent(
      files,
      undefined,
      {
        inPost: false,
        inMessage: true
      }
    )

    await messagesApi.massSend({
      createBatchMessageRequestDto: {
        includeListIds: listIds,
        excludeListIds: excludedIds,
        passIds: passIds,
        text: message,
        contentIds: contentIds,
        price: Number(messagePrice),
        previewIndex: 0 // TODO: add previewing FE
      }
    })
    setFiles([])
    setMessagePrice(0)
    setVaultContent([])
    setSelectedLists([])
    setSelectedPasses([])
    setExcludedLists([])
    setMassMessage(false)
    reset()
  }

  const submitMessage = async () => {
    try {
      onSubmit()
    } catch (error) {
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

  const prevent = (e: any) => {
    if (e.code === "Minus") {
      e.preventDefault()
    }
  }

  const handleChange = (event: any) => {
    const limit = 5
    setMessagePrice(event.target.value.slice(0, limit))
  }
  const options = {}
  return (
    <form
      className="grid w-full grid-cols-3 border-t border-[#fff]/10"
      onSubmit={handleSubmit(submitMessage)}
    >
      <div className="order-2 col-span-3 flex flex-col sm:order-1 sm:col-span-3">
        <div className="flex min-h-[45px] items-center justify-start gap-4 px-3 pt-2">
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
                value={messagePrice}
                name="postPrice"
                autoFocus
                id="postPrice"
                placeholder="$"
                aria-placeholder="$"
                onKeyPress={prevent}
                min="0"
                max="9999"
                onChange={(event) => handleChange(event)}
                className="min-w-[121px] max-w-[121px] rounded-md border-passes-dark-200 bg-[#100C11] py-1 pr-4 text-right text-[14px] font-bold leading-[25px] text-[#ffffff]/90  focus:border-passes-primary-color focus:ring-0"
              />
            </div>
          ) : null}
        </div>

        <div className="flex h-fit w-full flex-col items-start justify-start px-3 py-1">
          <textarea
            placeholder="Send a message.."
            rows={3}
            cols={40}
            {...register("message", { required: true })}
            className={classNames(
              files.length
                ? "focus:border-b-transparent"
                : errors.message && "border-b-red",
              "w-full resize-none border-x-0 border-b border-transparent bg-transparent p-2 text-[#ffffff]/90 focus:border-transparent focus:border-b-passes-primary-color focus:ring-0 md:m-0 md:p-0"
            )}
            autoComplete="off"
            onKeyDown={submitOnEnter}
            onFocus={() => {
              clearErrors()
            }}
          />
          {files.length > 0 && (
            <MediaSection
              register={register}
              errors={errors}
              files={files}
              onRemove={onRemove}
              addNewMedia={addNewMedia}
            />
          )}

          <div className="flex w-full items-center justify-between pt-6 ">
            <MediaSelector
              activeMediaHeader={activeMediaHeader}
              // setActiveMediaHeader={setActiveMediaHeader}
              register={register}
              errors={errors}
              onChange={onMediaHeaderChange}
              selectors={[PhotoSelector, VideoSelector]}
            >
              <VaultSelector selectVaultContent={addContent} />
            </MediaSelector>
            <button
              type="submit"
              className="flex min-w-[151px] items-center justify-start  rounded-[50px] bg-[#C943A8] py-2 px-4 text-[16px] font-bold leading-[25px] text-white"
            >
              Send message
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
