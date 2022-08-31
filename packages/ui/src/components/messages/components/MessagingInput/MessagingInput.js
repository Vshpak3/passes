import DeleteIcon from "public/icons/post-audience-x-icon.svg"
import PlusIcon from "public/icons/post-plus-icon.svg"
import React, { useCallback, useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { FormInput } from "src/components/atoms"
import { Dialog } from "src/components/organisms"
import MediaHeader from "src/components/pages/profile/main-content/new-post/header"
import { MediaFile } from "src/components/pages/profile/main-content/new-post/media"
import { classNames, formatCurrency } from "src/helpers"
import {
  ChatAutoComplete,
  EmojiPicker,
  useMessageInputContext
} from "stream-chat-react"

import { EmojiIcon, LightningBoltSmall } from "../../assets"
import { GiphyContext } from "../../index.js"

const GiphyIcon = () => (
  <div className="giphy-icon__wrapper">
    <LightningBoltSmall />
    <p className="giphy-icon__text">GIPHY</p>
  </div>
)

const MB = 1048576
const MAX_FILE_SIZE = 10 * MB
const MAX_FILES = 9

const MessagingInput = () => {
  const { giphyState, setGiphyState, files, setFiles } =
    useContext(GiphyContext)
  const messageInput = useMessageInputContext()
  const [activeMediaHeader, setActiveMediaHeader] = useState("Media")
  const [hasVault, setHasVault] = useState(false)
  const [hasPrice, setHasPrice] = useState(false)
  const [targetAcquired, setTargetAcquired] = useState(false)
  const {
    register,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {}
  })
  const postPrice = watch("postPrice")

  const onMediaHeaderChange = (event) => {
    if (typeof event !== "string") return onFileInputChange(event)
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

  const onFileInputChange = (event) => {
    const files = [...event.target.files]
    onMediaChange(files)
    event.target.value = ""
  }

  const onDragDropChange = (event) => {
    if (event?.target?.files) return onFileInputChange(event)
    const files = [...event.target.files]

    onMediaChange(files)
    event.target.value = ""
  }

  const onMediaChange = (filesProp) => {
    let maxFileSizeExceeded = false
    const _files = filesProp.filter((file) => {
      if (!MAX_FILE_SIZE) return true
      if (file.size < MAX_FILE_SIZE) return true
      maxFileSizeExceeded = true
      return false
    })

    if (maxFileSizeExceeded) {
      // TODO: show error message
    }

    if (files.length + _files.length > MAX_FILES) return // TODO: max file limit error message
    setFiles([...files, ..._files])
  }
  const onRemove = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const onChange = useCallback(
    (event) => {
      const { value } = event.target
      const deletePressed =
        event.nativeEvent?.inputType === "deleteContentBackward"

      if (messageInput.text.length === 1 && deletePressed) {
        setGiphyState(false)
      }

      if (
        !giphyState &&
        messageInput.text.startsWith("/giphy") &&
        !messageInput.numberOfUploads
      ) {
        event.target.value = value.replace("/giphy", "")
        setGiphyState(true)
      }

      messageInput.handleChange(event)
    },
    [giphyState, messageInput, setGiphyState]
  )

  return (
    <div>
      <style>{`
        .str-chat__messaging-input {
          background: #ffffff;
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: start;
          padding: 10px 20px;
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
        {files.length > 0 && (
          <div className="h-full w-full items-center overflow-y-auto pt-1">
            {files.length === 0 ? (
              <FormInput
                className="h-[170px]"
                register={register}
                name={"drag-drop"}
                type="drag-drop-file"
                multiple={true}
                accept={["image", "video"]}
                options={{ onChange: onDragDropChange }}
                errors={errors}
              />
            ) : (
              <div className="flex w-full flex-col items-start justify-start gap-6 overflow-hidden rounded-lg border-[1px] border-solid border-transparent p-1">
                <div className="flex items-center justify-start gap-6">
                  <div className="flex max-w-[190px] flex-nowrap items-center gap-6 overflow-x-auto md:max-w-[550px]">
                    {files.map((file, index) => (
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
                </div>
              </div>
            )}
          </div>
        )}
        <div className="w-full">
          <div className="messaging-input__container">
            <div
              className="messaging-input__button emoji-button"
              role="button"
              aria-roledescription="button"
              onClick={messageInput.openEmojiPicker}
              ref={messageInput.emojiPickerRef}
            >
              <div className="pt-[9px]">
                <EmojiIcon />
              </div>
            </div>
            <div className="messaging-input__input-wrapper">
              {giphyState && !messageInput.numberOfUploads && <GiphyIcon />}

              <ChatAutoComplete
                onChange={onChange}
                rows={3}
                placeholder="Send a message"
              />
            </div>
          </div>
          <EmojiPicker />
        </div>

        <div className="flex w-full items-center justify-between border-t border-passes-dark-200 py-3 pr-5">
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
            <div
              className="messaging-input__button"
              role="button"
              aria-roledescription="button"
              onClick={messageInput.handleSubmit}
            >
              <button className="cursor-pointer gap-[10px] rounded-[50px] bg-passes-dark-200 px-[18px] py-[10px] text-white">
                Send message
              </button>
            </div>
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
                        onClick={() => setHasPrice(false)}
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
      </>
      <>
        {hasVault && (
          <Dialog
            className="flex w-screen transform flex-col items-center justify-center border border-[#ffffff]/10 bg-[#0c0609] px-[29px] py-5 transition-all md:max-w-[544px] md:rounded-[20px]"
            open={true}
            title={
              <div className="relative h-full">
                <div className="flex flex-col items-start justify-start gap-3">
                  <div>Vault Items come here</div>
                  <div className="flex w-full items-end justify-end gap-3">
                    <button
                      className="rounded-full bg-passes-secondary-color py-2 px-6"
                      type="button"
                      onClick={() => setHasVault(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="rounded-full bg-passes-secondary-color py-2 px-6"
                      type="button"
                      onClick={() => setHasVault(false)}
                    >
                      Use selected media
                    </button>
                  </div>
                </div>
              </div>
            }
          ></Dialog>
        )}
      </>
    </div>
  )
}

export default React.memo(MessagingInput)
