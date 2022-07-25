import {
  ChatAutoComplete,
  EmojiIconLarge,
  EmojiPicker,
  SendButton,
  Tooltip,
  useMessageInputContext
} from "stream-chat-react"
export const MomentMessageInput = () => {
  const {
    closeEmojiPicker,
    emojiPickerIsOpen,
    handleEmojiKeyDown,
    handleSubmit,
    openEmojiPicker
  } = useMessageInputContext()
  return (
    <div className="str-chat__input-flat str-chat__input-flat--send-button-active">
      <div className="str-chat__input-flat-wrapper">
        <div className="str-chat__input-flat--textarea-wrapper">
          <ChatAutoComplete />
          <div className="str-chat__emojiselect-wrapper">
            <Tooltip>
              {emojiPickerIsOpen ? "Close emoji picker" : "Open emoji picker"}
            </Tooltip>
            <span
              className="str-chat__input-flat-emojiselect"
              onClick={emojiPickerIsOpen ? closeEmojiPicker : openEmojiPicker}
              onKeyDown={handleEmojiKeyDown}
              role="button"
              tabIndex={0}
            >
              <EmojiIconLarge />
            </span>
          </div>
          <EmojiPicker />
        </div>
        <SendButton sendMessage={handleSubmit} />
      </div>
    </div>
  )
}
