import { yupResolver } from "@hookform/resolvers/yup"
import {
  ChannelMemberDto,
  ContentDto,
  PayinDataDtoBlockedEnum
} from "@passes/api-client"
import { MessagesApi } from "@passes/api-client/apis"
import classNames from "classnames"
import { debounce } from "lodash"
import React, {
  ChangeEvent,
  Dispatch,
  FC,
  KeyboardEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { date, object } from "yup"

import { Button } from "src/components/atoms/button/Button"
import { Checkbox } from "src/components/atoms/input/Checkbox"
import { NumberInput } from "src/components/atoms/input/NumberInput"
import { Text } from "src/components/atoms/Text"
import { VaultSelector } from "src/components/atoms/VaultSelector"
import { MediaSectionReorder } from "src/components/organisms/MediaSectionReorder"
import {
  MediaSelector,
  PhotoSelector,
  VideoSelector
} from "src/components/organisms/MediaSelector"
import {
  MAX_PAID_MESSAGE_PRICE,
  MAX_TIP_MESSAGE_PRICE,
  MIN_PAID_MESSAGE_PRICE
} from "src/config/messaging"
import { ContentService } from "src/helpers/content"
import { yupPaid } from "src/helpers/yup"
import { useTippedMessageModal } from "src/hooks/context/useTippedMessageModal"
import { ContentFile, useMedia } from "src/hooks/useMedia"
import { usePay } from "src/hooks/usePay"

export interface InputMessageFormProps {
  text: string
  files: ContentFile[]
  isPaid: boolean
  price: string
  scheduledAt: Date | null
}

interface InputMessageProps {
  selectedChannel: ChannelMemberDto
  minimumTip?: number | null
  isCreator: boolean
  otherUserIsCreator?: boolean
  vaultContent: ContentDto[]
  setVaultContent: Dispatch<SetStateAction<ContentDto[]>>
  removeFree: () => void
}

export const InputMessageFormDefaults: InputMessageFormProps = {
  text: "",
  files: [],
  isPaid: false,
  price: "",
  scheduledAt: null
}

const api = new MessagesApi()

export const newMessageFormSchema = object(
  // give generic error text
  {
    ...yupPaid(
      "message",
      MIN_PAID_MESSAGE_PRICE,
      MAX_PAID_MESSAGE_PRICE,
      "Message can't be empty"
    ),
    scheduledAt: date().nullable()
  }
)

export const InputMessage: FC<InputMessageProps> = ({
  selectedChannel,
  minimumTip,
  isCreator,
  vaultContent,
  setVaultContent,
  otherUserIsCreator,
  removeFree
}) => {
  const channelId = selectedChannel.channelId ?? ""
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues
  } = useForm<InputMessageFormProps>({
    defaultValues: { ...InputMessageFormDefaults },
    resolver: yupResolver(newMessageFormSchema)
  })
  const [tip, setTip] = useState(0)
  const { files, setFiles, addNewMedia, onRemove, addContent } = useMedia(
    vaultContent.map((content) => new ContentFile(undefined, content))
  )
  useEffect(() => {
    setValue("files", files, { shouldValidate: true })
  }, [files, setValue])

  const [activeMediaHeader, setActiveMediaHeader] = useState("Media")
  const isPaid = watch("isPaid")
  const [mediaPreviewIndex, setMediaPreviewIndex] = useState(0)

  const onMediaChange = (event: ChangeEvent<HTMLInputElement>) => {
    setActiveMediaHeader("")
    addNewMedia(event.target.files)
    event.target.value = ""
  }

  const { setTippedMessage, setOnModalCallback, setSelectedChannel } =
    useTippedMessageModal()

  const clear = () => {
    setFiles([])
    setVaultContent([])
    reset()
    if (!tip) {
      removeFree()
    }
    setTip(0)
  }

  const setSubmitError = (err: string) => {
    err ? toast.error(err) : toast.dismiss()
  }

  const getRequest = async () => {
    const contentIds = await new ContentService().uploadUserContent({
      files,
      inMessage: true
    })
    const values = getValues()
    return {
      text: values.text,
      contentIds: contentIds,
      channelId,
      tipAmount: tip,
      price: isPaid ? parseFloat(values.price) : 0,
      previewIndex: isPaid ? mediaPreviewIndex : 0
    }
  }

  const registerMessage = async () => {
    return await api.sendMessage({
      sendMessageRequestDto: await getRequest()
    })
  }

  const registerMessageData = async () => {
    return await api.sendMessageData({
      sendMessageRequestDto: {
        text: "text",
        contentIds: [],
        channelId,
        tipAmount: tip,
        previewIndex: 0
      }
    })
  }

  const submitMessage = async () => {
    if (!channelId) {
      return false
    }
    try {
      await submitData(tip)
      if (!blocked) {
        // submit()
        if (tip > 0) {
          setOnModalCallback(() => clear)
          setSelectedChannel(selectedChannel)
          setTippedMessage(await getRequest())
        } else {
          await submit()
          clear()
        }
      }
    } catch (error) {
      setSubmitError("There was an error sending the message")
    }
  }

  const onCallback = (error: unknown) => {
    if (error) {
      setSubmitError("There was an error sending the message")
    }
  }

  const submitOnEnter = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.which === 13 && !event.shiftKey) {
      event.preventDefault()
      handleSubmit(submitMessage)()
    }
  }
  const { blocked, loading, submit, submitData } = usePay(
    registerMessage,
    registerMessageData,
    onCallback
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeTip = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setTip(parseFloat(parseFloat(value.length ? value : "0").toFixed(2)))
    }, 100),
    [setTip]
  )

  useEffect(() => {
    if (channelId && !isNaN(tip)) {
      const fetch = async () => {
        await submitData(tip)
      }
      fetch()
    }
  }, [channelId, submitData, tip])

  return (
    <form
      className="flex w-full border-t border-passes-gray"
      onSubmit={handleSubmit(submitMessage)}
    >
      <div className="flex w-full flex-col pt-2">
        {isCreator && (
          <div className="flex w-full items-center justify-between px-[10px] py-1 md:px-[30px]">
            <div className="flex h-[30px] items-center justify-start gap-4 pl-[10px] md:pl-0">
              <Checkbox
                className="group"
                errors={errors}
                label="Pay to View"
                name="isPaid"
                register={register}
                type="toggle"
              />
              {isPaid ? (
                <div className="relative flex items-center shadow-sm">
                  <div className="absolute left-4 text-[14px] font-bold leading-[25px] text-[#ffffff]/40">
                    Price
                  </div>
                  <NumberInput
                    className="h-[40px] w-full rounded-md border-passes-dark-200 bg-[#100C11] p-0 px-[18px] py-[10px] text-right text-base font-bold text-[#ffffff]/90"
                    maxInput={MAX_PAID_MESSAGE_PRICE}
                    name="price"
                    register={register}
                    type="currency"
                  />
                </div>
              ) : null}
            </div>
          </div>
        )}

        <textarea
          cols={40}
          placeholder="Send a message.."
          rows={3}
          {...register("text")}
          autoComplete="off"
          className={classNames(
            files.length
              ? "focus:border-b-transparent"
              : errors.text && "border-b-red",
            "w-full resize-none  border-x-0 border-b border-transparent bg-transparent p-2 px-[10px] pt-3 text-[#ffffff]/90 focus:border-transparent focus:border-b-passes-primary-color focus:ring-0 md:m-0 md:p-0 md:px-[30px]"
          )}
          name="text"
          // onFocus={() => {
          //   clearErrors()
          // }}
          onKeyDown={submitOnEnter}
        />
        {files.length > 0 && (
          <div className="flex px-2 md:px-5">
            <MediaSectionReorder
              addNewMedia={addNewMedia}
              errors={errors}
              files={files}
              isPaid={isPaid}
              mediaPreviewIndex={mediaPreviewIndex}
              onRemove={onRemove}
              register={register}
              setFiles={setFiles}
              setMediaPreviewIndex={setMediaPreviewIndex}
            />
          </div>
        )}
        {Object.values(errors)[0] && (
          <Text className="mx-5 mt-1 block text-[red]" fontSize={12}>
            {Object.values(errors)[0]?.message}
          </Text>
        )}
        <div
          className={classNames(
            "mb-5 flex w-full flex-row items-center justify-between border-b border-passes-gray py-4 md:mb-0 md:border-0 md:pt-5",
            Object.values(errors)[0] && "!pt-0"
          )}
        >
          {isCreator ? (
            <MediaSelector
              activeMediaHeader={activeMediaHeader}
              errors={errors}
              onChange={onMediaChange}
              register={register}
              selectors={[PhotoSelector, VideoSelector]}
            >
              <div>
                <VaultSelector selectVaultContent={addContent} />
              </div>
            </MediaSelector>
          ) : (
            <div />
          )}
          <div className="flex flex-row items-center justify-end gap-[10px] px-[5px] py-1 md:px-[20px]">
            {otherUserIsCreator && (
              <div className="relative">
                <div
                  className={classNames(
                    "absolute left-4 text-[14px] font-medium leading-[25px] text-[#B52A6F] ",
                    blocked === PayinDataDtoBlockedEnum.InsufficientTip
                      ? "top-0.5 md:top-1"
                      : "top-1.5 md:top-2.5"
                  )}
                >
                  Tip
                </div>
                {blocked === PayinDataDtoBlockedEnum.InsufficientTip ? (
                  <span className="absolute left-4 top-6 whitespace-nowrap text-[11px] font-normal leading-[13px] text-red-500">
                    minimum ${minimumTip ? minimumTip.toFixed(2) : "0.00"}
                  </span>
                ) : null}
                <NumberInput
                  className="flex h-[45px] min-w-[150px] max-w-[150px] items-center justify-between rounded-[6px] border border-[#B52A6F] px-3 py-[6px] text-right focus:border-[#B52A6F]"
                  maxInput={MAX_TIP_MESSAGE_PRICE}
                  name="tip"
                  onChange={handleChangeTip}
                  register={register}
                  type="currency"
                />
              </div>
            )}
            <div
              aria-roledescription="button"
              className="flex h-[45px] flex-col content-center justify-center"
              role="button"
            >
              <Button
                big
                className="w-[130px]"
                disabled={isNaN(tip) || !!blocked || loading}
                disabledClass="cursor-not-allowed"
                onClick={handleSubmit(submitMessage)}
                variant="pink"
              >
                {loading
                  ? "Sending..."
                  : blocked ===
                    PayinDataDtoBlockedEnum.TooManyPurchasesInProgress
                  ? "Waiting on Payment"
                  : blocked === PayinDataDtoBlockedEnum.DoesNotFollow
                  ? "Not following"
                  : blocked === PayinDataDtoBlockedEnum.InsufficientTip
                  ? "Insufficient tip"
                  : // : blocked === PayinDataDtoBlockedEnum.NoPayinMethod
                    // ? "No Payment Method (go to settings)"
                    ` Send Message`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
