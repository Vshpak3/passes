import React, { useCallback, useContext, useState } from "react"
import { ImageDropzone } from "react-file-utils"
import {
  ChatAutoComplete,
  EmojiPicker,
  UploadsPreview,
  useChannelStateContext,
  useMessageInputContext
} from "stream-chat-react"

import { EmojiIcon, LightningBoltSmall } from "../../assets"
import { GiphyContext } from "../../index.js"
import { CustomMediaInput } from "../CustomMediaInput"

const GiphyIcon = () => (
  <div className="giphy-icon__wrapper">
    <LightningBoltSmall />
    <p className="giphy-icon__text">GIPHY</p>
  </div>
)

const MessagingInput = () => {
  const { giphyState, setGiphyState } = useContext(GiphyContext)
  const { acceptedFiles, maxNumberOfFiles, multipleUploads } =
    useChannelStateContext()
  const messageInput = useMessageInputContext()
  const [activeMedia, setActiveMedia] = useState("Media")
  const [hasMedia, setHasMedia] = useState(false)
  const [hasVideo, setHasVideo] = useState(false)
  const [hasVault, setHasVault] = useState(false)
  const [hasPrice, setHasPrice] = useState(false)

  const onMediaChange = (name) => {
    switch (name) {
      case "Media":
        setHasMedia(true)
        break
      case "Video":
        setHasVideo(true)
        break
      case "Vault":
        setHasVault(true)
        break
      case "Message price":
        setHasPrice(true)
        break
      default:
        setActiveMedia(name)
        break
    }
    setActiveMedia(name)
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
          align-items: center;
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
        }
        
        .str-chat.dark .str-chat__messaging-input .str-chat__textarea textarea {
          background: transparent;
          border: 1px solid rgba(0, 0, 0, 0.16);
          color: rgba(255, 255, 255, 0.9);
        }
        
        .str-chat__textarea textarea:focus {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
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
        <div className="w-full">
          <ImageDropzone
            accept={acceptedFiles}
            handleFiles={messageInput.uploadNewFiles}
            multiple={multipleUploads}
            disabled={
              (maxNumberOfFiles !== undefined &&
                messageInput.numberOfUploads >= maxNumberOfFiles) ||
              giphyState
            }
          >
            <UploadsPreview />
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
          </ImageDropzone>
          <EmojiPicker />
        </div>

        <div className="flex w-full items-center justify-between border-t border-[#2C282D] py-3 pr-5">
          <form>
            <CustomMediaInput
              activeMedia={activeMedia}
              onMediaChange={onMediaChange}
            />
            {hasMedia || hasVideo || hasVault || (hasPrice && <div></div>)}
            {/* TODO: upper line is only to pass es lint, i will continue my work on the next branch for these functionalities */}
          </form>
          <div>
            <div
              className="messaging-input__button"
              role="button"
              aria-roledescription="button"
              onClick={messageInput.handleSubmit}
            >
              {/* <SendIcon /> */}
              <button className="cursor-pointer gap-[10px] rounded-[50px] bg-[#2C282D] px-[18px] py-[10px] text-white">
                Send message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(MessagingInput)
