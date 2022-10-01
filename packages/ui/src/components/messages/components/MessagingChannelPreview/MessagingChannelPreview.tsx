// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useContext } from "react"
import { formatCurrency } from "src/helpers"
import { ChatContext } from "stream-chat-react"

import { getCleanImage } from "../../assets"
import { Avatar } from "../ChannelListAvatar.js"

const getAvatarGroup = (members: any) => {
  if (members.length === 1) {
    return (
      <Avatar
        image={getCleanImage(members[0])}
        name={members[0].user?.id}
        size={40}
      />
    )
  }

  if (members.length === 2) {
    return (
      <div className="channel-preview__avatars two">
        <span>
          <Avatar
            image={getCleanImage(members[0])}
            name={members[0]?.user?.id}
            shape="square"
            size={40}
          />
        </span>
        <span>
          <Avatar
            image={getCleanImage(members[1])}
            name={members[1]?.user?.id}
            shape="square"
            size={40}
          />
        </span>
      </div>
    )
  }

  if (members.length === 3) {
    return (
      <div className="channel-preview__avatars three">
        <span>
          <Avatar
            image={getCleanImage(members[0])}
            name={members[0]?.user?.id}
            shape="square"
            size={40}
          />
        </span>
        <span>
          <Avatar
            image={getCleanImage(members[1])}
            name={members[1]?.user?.id}
            shape="square"
            size={20}
          />
          <Avatar
            image={getCleanImage(members[2])}
            name={members[2]?.user?.id}
            shape="square"
            size={20}
          />
        </span>
      </div>
    )
  }

  if (members.length >= 4) {
    return (
      <div className="channel-preview__avatars">
        <span>
          <Avatar
            image={getCleanImage(members[members.length - 1])}
            name={members[0]?.user?.id}
            shape="square"
            size={20}
          />
          <Avatar
            image={getCleanImage(members[members.length - 2])}
            name={members[1]?.user?.id}
            shape="square"
            size={20}
          />
        </span>
        <span>
          <Avatar
            image={getCleanImage(members[members.length - 3])}
            name={members[2]?.user?.id}
            shape="square"
            size={20}
          />
          <Avatar
            image={getCleanImage(members[members.length - 4])}
            name={members[3]?.user?.id}
            shape="square"
            size={20}
          />
        </span>
      </div>
    )
  }

  return null
}

const getChannelUnreadTip = (messagesStats: any, channel: any) => {
  const mapChannelId = messagesStats.reduce((map: any, stat: any) => {
    map[stat.channelId] = stat
    return map
  }, {})
  if (!mapChannelId[channel.data.id]) {
    return 0
  }
  return mapChannelId[channel.data.id].unreadTip
  // if (channelStats[0]?.unreadTip) return channelStats[0]?.unreadTip
  // else return null
}

const getTimeStamp = (channel: any) => {
  let lastHours = channel.state.last_message_at?.getHours()
  let lastMinutes = channel.state.last_message_at?.getMinutes()
  let half = "AM"

  if (lastHours === undefined || lastMinutes === undefined) {
    return ""
  }

  if (lastHours > 12) {
    lastHours = lastHours - 12
    half = "PM"
  }

  if (lastHours === 0) {
    lastHours = 12
  }
  if (lastHours === 12) {
    half = "PM"
  }

  if (lastMinutes.toString().length === 1) {
    lastMinutes = `0${lastMinutes}`
  }

  return `${lastHours}:${lastMinutes} ${half}`
}

const getChannelName = (members: any) => {
  const defaultName = "Johnny Blaze"

  if (!members.length || members.length === 1) {
    return members[0]?.user.name || defaultName
  }

  return `${members[0]?.user.name || defaultName}, ${
    members[1]?.user.name || defaultName
  }`
}

const MessagingChannelPreview = (props: any) => {
  const {
    channel,
    latestMessage,
    setActiveChannel,
    setIsCreating,
    messagesStats,
    isCreator
  } = props

  const { channel: activeChannel, client } = useContext(ChatContext)

  const members = Object.values(channel.state.members).filter(
    ({ user }) => user?.id !== client?.userID
  )

  const tip = getChannelUnreadTip(messagesStats, channel)

  return (
    <div>
      <style>
        {`
        .channel-preview__container {
          height: 56px;
          margin-bottom: 8px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-left: 15px;

        }

        .channel-preview__container:hover {
          background: #1E1820;
          box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.07);
          transition: background 0.1s ease-in-out;
        }

        .str-chat.dark .channel-preview__container:hover {
          background: #1E1820;
        }

        .channel-preview__container.selected {
          background: #1E1820;
          background-color:#1E1820;
          box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.07);
          transition: background 0.1s ease-in-out;
        }

        .str-chat.dark .channel-preview__container.selected {
          background: #1E1820;
        }

        .channel-preview__content-wrapper {
          display: flex;
          // flex-direction: column;
          justify-content: center;
          margin-left: 8px;
          margin-right: 8px;
          width: 100%;
        }

        .channel-preview__content-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0;
          height: 18px;
          margin-bottom: 4px;
        }

        .channel-preview__content-name {
          font-family: Helvetica Neue, sans-serif;
          font-weight: 500;
          font-size: 15px;
          color: #000000;
          margin: 0;
          max-width: 158px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .str-chat.dark .channel-preview__content-name {
          color: #ffffff;
        }

        .channel-preview__content-time {
          font-family: Helvetica Neue, sans-serif;
          font-size: 11px;
          color: #858688;
          margin: 0;
        }

        .channel-preview__content-message {
          font-family: Helvetica Neue, sans-serif;
          font-size: 13px;
          line-height: 16px;
          margin: 0;
          color: #858688;
          height: 16px;
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .channel-preview__container .str-chat__avatar {
          margin-right: 0;
        }

        .channel-preview__avatars {
          display: flex;
          align-items: center;
          height: 40px;
          min-width: 40px;
          max-width: 40px;
          border-radius: 20px;
          overflow: hidden;
        }

        .channel-preview__avatars.two div:first-child {
          position: relative;
          right: 10px;
        }

        .channel-preview__avatars.two div:nth-child(2) {
          position: relative;
          right: 30px;
        }

        .channel-preview__avatars.two span {
          width: 20px;
          overflow: hidden;
        }

        .channel-preview__avatars.three span {
          width: 20px;
          overflow: hidden;
        }

        `}
      </style>

      <div
        className={
          channel?.id === activeChannel?.id
            ? "channel-preview__container selected"
            : "channel-preview__container"
        }
        onClick={() => {
          setIsCreating(false)
          setActiveChannel(channel)
        }}
      >
        {getAvatarGroup(members)}
        <div className="channel-preview__content-wrapper">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col items-start">
              <p className="channel-preview__content-name">
                {channel.data.name || getChannelName(members)}
              </p>
              <p className="channel-preview__content-message">
                {latestMessage || "Send a message"}
              </p>
            </div>
            {tip > 0 && isCreator ? (
              <div className="flex flex-col items-center justify-center pt-2">
                <div className="flex h-[20px] w-[60px] items-center justify-center gap-4 rounded-[30px] bg-passes-secondary-color">
                  <span className="cursor-pointer text-[10px] font-medium leading-[16px] text-[#FFF]">
                    Tip: {formatCurrency(tip)}
                  </span>
                </div>

                <p className="channel-preview__content-time ">
                  {getTimeStamp(channel)}
                </p>
              </div>
            ) : (
              <div className="flex w-[60px] justify-center self-start text-center">
                <p className="channel-preview__content-time ">
                  {getTimeStamp(channel)}
                </p>
              </div>
            )}
          </div>
          {/* <div className="channel-preview__content-top">
            <p className="channel-preview__content-name">
              {channel.data.name || getChannelName(members)}
            </p>
            <p className="channel-preview__content-time">
              {getTimeStamp(channel)}
            </p>
          </div>
          <p className="channel-preview__content-message">
            {latestMessage || "Send a message"}
          </p> */}
        </div>
      </div>
    </div>
  )
}

export default MessagingChannelPreview
