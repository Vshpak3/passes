import React, { useEffect, useRef, useState } from "react"
import {
  Avatar,
  useChannelStateContext,
  useChatContext
} from "stream-chat-react"

import {
  ChannelInfoIcon,
  ChannelSaveIcon,
  getCleanImage,
  HamburgerIcon
} from "../../assets"
import { TypingIndicator } from "../TypingIndicator/TypingIndicator"

const getAvatarGroup = (members) => {
  if (members.length === 1) {
    return (
      <div className="messaging__channel-header__avatars">
        <Avatar
          image={getCleanImage(members[0])}
          name={members[0].user?.id}
          size={40}
        />
        ;
      </div>
    )
  }

  if (members.length === 2) {
    return (
      <div className="messaging__channel-header__avatars two">
        <span>
          <Avatar
            image={getCleanImage(members[0])}
            name={members[0].user?.id}
            shape="square"
            size={40}
          />
        </span>
        <span>
          <Avatar
            image={getCleanImage(members[1])}
            name={members[1].user?.id}
            shape="square"
            size={40}
          />
        </span>
      </div>
    )
  }

  if (members.length === 3) {
    return (
      <div className="messaging__channel-header__avatars three">
        <span>
          <Avatar
            image={getCleanImage(members[0])}
            name={members[0].user?.id}
            shape="square"
            size={40}
          />
        </span>
        <span>
          <Avatar
            image={getCleanImage(members[1])}
            name={members[1].user?.id}
            shape="square"
            size={20}
          />
          <Avatar
            image={getCleanImage(members[2])}
            name={members[2].user?.id}
            shape="square"
            size={20}
          />
        </span>
      </div>
    )
  }

  if (members.length >= 4) {
    return (
      <div className="messaging__channel-header__avatars four">
        <span>
          <Avatar
            image={getCleanImage(members[members.length - 1])}
            name={members[0].user?.id}
            shape="square"
            size={20}
          />
          <Avatar
            image={getCleanImage(members[members.length - 2])}
            name={members[1].user?.id}
            shape="square"
            size={20}
          />
        </span>
        <span>
          <Avatar
            image={getCleanImage(members[members.length - 3])}
            name={members[2].user?.id}
            shape="square"
            size={20}
          />
          <Avatar
            image={getCleanImage(members[members.length - 4])}
            name={members[3].user?.id}
            shape="square"
            size={20}
          />
        </span>
      </div>
    )
  }

  return null
}

const MessagingChannelHeader = (props) => {
  const { client } = useChatContext()
  const { channel } = useChannelStateContext()

  const [channelName, setChannelName] = useState(channel?.data.name || "")
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState("")

  const inputRef = useRef()

  const members = Object.values(channel.state?.members || {}).filter(
    (member) => member.user?.id !== client.user?.id
  )

  const updateChannel = async (e) => {
    if (e) e.preventDefault()

    if (channelName && channelName !== channel.data.name) {
      await channel.update(
        { name: channelName },
        { text: `Channel name changed to ${channelName}` }
      )
    }

    setIsEditing(false)
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  useEffect(() => {
    if (!channelName) {
      setTitle(
        members
          .map(
            (member) => member.user?.name || member.user?.id || "Unnamed User"
          )
          .join(", ")
      )
    }
  }, [channelName, members])

  const EditHeader = () => (
    <form
      style={{ flex: 1 }}
      onSubmit={(e) => {
        e.preventDefault()
        inputRef.current.blur()
      }}
    >
      <input
        autoFocus
        className="channel-header__edit-input"
        onBlur={updateChannel}
        onChange={(e) => setChannelName(e.target.value)}
        placeholder="Type a new name for the chat"
        ref={inputRef}
        value={channelName}
      />
    </form>
  )

  return (
    <div>
      <style>
        {`
        .messaging__channel-header {
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0px 7px 9px rgba(0, 0, 0, 0.03), 0px 1px 0px rgba(0, 0, 0, 0.03);
          transform: matrix(1, 0, 0, 1, 0, 0);
          border-radius: 10px 10px 0px 0px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 60px;
        }
        
        .messaging__channel-header .channel-header__name {
          flex: 1;
          font-weight: bold;
          font-size: 15px;
          color: rgba(0, 0, 0, 0.9);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .str-chat.dark .messaging__channel-header {
          background: rgba(46, 48, 51, 0.98);
          box-shadow: 0px 7px 9px rgba(0, 0, 0, 0.03), 0px 1px 0px rgba(0, 0, 0, 0.03);
        }
        
        .str-chat.dark .messaging__channel-header .channel-header__name {
          color: rgba(255, 255, 255, 0.9);
        }
        
        .messaging__channel-header__right {
          display: flex;
          align-items: center;
          margin-right: 16px;
        }
        
        .messaging__channel-header__avatars {
          display: flex;
          align-items: center;
          height: 40px;
          min-width: 40px;
          max-width: 40px;
          border-radius: 20px;
          overflow: hidden;
          margin-right: 20px;
          margin-left: 20px;
        }
        
        .messaging__channel-header__avatars.two div:first-child {
          position: relative;
          right: 10px;
        }
        
        .messaging__channel-header__avatars.two div:nth-child(2) {
          position: relative;
          right: 14px;
        }
        
        .messaging__channel-header__avatars.two span {
          width: 20px;
          overflow: hidden;
        }
        
        .messaging__channel-header__avatars.three span {
          width: 20px;
          overflow: hidden;
        }
        
        .messaging__channel-header__avatars.four span:nth-child(2) {
          position: relative;
          right: 10px;
        }
        
        .channel-header__edit-input {
          width: 100%;
          font-family: Helvetica Neue, sans-serif;
          font-size: 17px;
          background: none;
          outline: none;
          border: none;
          padding: 0;
        }
        
        .channel-header__edit-input::placeholder {
          opacity: 50%;
        }
        
        .str-chat.dark .channel-header__edit-input::placeholder {
          color: #ffffff;
        }
        
        .str-chat.dark .channel-header__edit-input {
          color: #ffffff;
        }
        
        #mobile-nav-icon {
          display: none;
        }
        
        @media screen and (max-width: 640px) {
          #mobile-nav-icon {
            display: block;
            padding-left: 5px;
          }
        
          #mobile-nav-icon.light svg path {
            fill: darkslategrey;
            stroke: darkslategrey;
            fill-opacity: 60%;
          }
        
          .messaging__channel-header__avatars {
            margin-left: 10px;
          }
        }
        `}
      </style>
      <div className="messaging__channel-header">
        <div
          id="mobile-nav-icon"
          className={`${props.theme}`}
          onClick={() => props.toggleMobile()}
        >
          <HamburgerIcon />
        </div>
        {getAvatarGroup(members)}
        {!isEditing ? (
          <div className="channel-header__name">{channelName || title}</div>
        ) : (
          <EditHeader />
        )}
        <div className="messaging__channel-header__right">
          <TypingIndicator />
          {channelName !== "Social Demo" &&
            (!isEditing ? (
              <ChannelInfoIcon {...{ isEditing, setIsEditing }} />
            ) : (
              <ChannelSaveIcon />
            ))}
        </div>
      </div>
    </div>
  )
}

export default React.memo(MessagingChannelHeader)
