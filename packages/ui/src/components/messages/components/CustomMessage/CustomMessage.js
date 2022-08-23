import React from "react"
import { MessageSimple } from "stream-chat-react"

const CustomMessage = (props) => {
  return (
    <>
      <style>{`

.str-chat__message-actions-box {
  border-radius: 16px;
}

.str-chat__list--thread
  .str-chat__message-simple__actions__action--options
  .str-chat__message-actions-box {
  border-radius: 16px;
}

.str-chat__message
  .str-chat__message-simple__actions__action--options
  .str-chat__message-actions-box--mine {
  box-shadow: 0 10px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.15);
  border-radius: 16px;
}

.str-chat.dark
  .str-chat__message
  .str-chat__message-simple__actions__action--options
  .str-chat__message-actions-box {
    background: linear-gradient(-180deg,hsla(0,0%,100%,.02),rgba(0,0,0,.02)), #67686a;
    box-shadow: 0 0 2px 0 rgb(0 0 0 / 22%), 0 1px 0 0 rgb(0 0 0 / 8%), 0 1px 8px 0 rgb(0 0 0 / 5%);
    border-radius: 16px;
}

.str-chat.dark
  .str-chat__message
  .str-chat__message-simple__actions__action--options
  .str-chat__message-actions-box--mine {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.0001) 0%, rgba(0, 0, 0, 0.5) 100%),
    rgba(0, 0, 0, 0.7);
  border-radius: 16px;
}

.str-chat.dark
  .str-chat__message-simple__actions__action.str-chat__message-simple__actions__action--reactions
  g {
  fill: #ffffff;
}

.str-chat__message-actions-list-item {
  font-weight: 500;
}

/* EDIT MESSAGE */

.str-chat__modal.str-chat__modal--open {
  border: none !important;
  opacity: 1;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.5);
}

.str-chat.dark .str-chat__modal.str-chat__modal--open {
  background: rgba(0, 0, 0, 0.5);
}

.str-chat__modal__inner {
  height: 160px;
  width: 400px;
  border: none !important;
  background: #f1f1f1;
  box-shadow: 0px 10px 12px rgba(0, 0, 0, 0.15), 0px 2px 4px rgba(0, 0, 0, 0.15);
}

.str-chat.dark .str-chat__modal__inner {
  background: #2e3033 !important;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.08);
}

.str-chat__edit-message-form {
  position: relative;
  top: 40px;
}

.str-chat__modal .str-chat__edit-message-form textarea {
  border: 2px solid rgba(0, 0, 0, 0.16) !important;
  height: 50px !important;
  max-height: 50px !important;
  font-size: 15px;
  border-radius: 20px !important;
  transition: border 0.2s ease-in-out;
  box-shadow: none;
}

.str-chat.dark .str-chat__modal .str-chat__edit-message-form textarea {
  background: rgba(46, 48, 51, 0.98) !important;
}

.str-chat__modal .str-chat__edit-message-form textarea:focus {
  border: 2px solid #006cff !important;
}

.str-chat__modal .str-chat__message-team-form-footer {
  margin-top: 12px;
}

.str-chat__modal .str-chat__message-team-form-footer button {
  cursor: pointer;
}

.str-chat__modal__close-button svg {
  top: 0px;
  margin-left: 8px;
}

.str-chat__modal__close-button {
  position: relative;
  top: -55px;
  left: 400px;
}

.str-chat.light .str-chat__modal__close-button svg {
  fill: #000000;
}

.str-chat.light .str-chat__modal__close-button {
  color: #000000;
}

.str-chat__modal__close-button:hover {
  color: #006cff !important;
  opacity: 1;
}

.str-chat__modal__close-button:hover svg {
  fill: #006cff !important;
}

.str-chat__modal .str-chat__message-team-form-footer svg:hover {
  fill: #006cff;
}

.str-chat__edit-message-form .rfu-file-upload-button {
  display: none;
}

.str-chat__edit-message-form .str-chat__message-team-form-footer button[type='submit'] {
  padding-right: 0;
}

.str-chat__edit-message-form .str-chat__message-team-form-footer button:focus {
  border: none;
  outline: none;
}

/* REACTIONS */

.str-chat__reaction-selector {
  border-radius: 16px;
  height: 56px;
  background: #f1f1f1;
  box-shadow: 0px 10px 12px rgba(0, 0, 0, 0.15), 0px 2px 4px rgba(0, 0, 0, 0.15);
}

.str-chat.dark .str-chat__reaction-selector {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.0001) 0%, rgba(0, 0, 0, 0.5) 100%),
    rgba(0, 0, 0, 0.7);
}

.str-chat__reaction-selector li {
  font-size: 24px;
}

.str-chat__reaction-selector li span span {
  height: 24px !important;
  width: 24px !important;
}

span.react-images__footer__count.react-images__footer__count--isModal {
  font-family: Helvetica Neue, sans-serif;
}

.str-chat__message.str-chat__message--me.str-chat__message-simple.str-chat__message-simple--me.str-chat__message--regular
  .str-chat__avatar {
  display: none;
}

.str-chat__message.str-chat__message--me.str-chat__message-simple.str-chat__message-simple--me.str-chat__message--reply
  .str-chat__avatar {
  display: none;
}

.str-chat__message.str-chat__message--me.str-chat__message-simple.str-chat__message--deleted.deleted {
  margin: 0;
}

@media screen and (max-width: 640px) {
  /* REACTIONS */

  .str-chat__message--me .str-chat__message-inner > .str-chat__message-simple__actions,
  .str-chat__message-simple--me .str-chat__message-inner > .str-chat__message-simple__actions {
    margin-bottom: 6px;
  }

  .str-chat__message-inner > .str-chat__message-simple__actions,
  .str-chat__message-simple-inner > .str-chat__message-simple__actions {
    margin-bottom: 6px;
  }

  .str-chat__message--has-attachment .str-chat__message-simple__actions {
    position: unset;
    margin-bottom: 6px;
  }

  /* EDIT MESSAGE */

  .str-chat__modal.str-chat__modal--open {
    padding-top: 200px;
  }

  .str-chat__modal__inner {
    max-width: 80vw;
  }

  .str-chat__modal .str-chat__edit-message-form {
    max-width: 80vw;
    min-width: unset;
  }

  .str-chat__modal__close-button {
    left: 75vw;
  }
}
`}</style>
      <MessageSimple {...props} />
    </>
  )
}

export default CustomMessage
