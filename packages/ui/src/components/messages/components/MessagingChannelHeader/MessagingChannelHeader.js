import CurrencyIcon from "public/icons/messages-currency-icon.svg"
import SearchIcon from "public/icons/messages-search-icon.svg"
import StarIcon from "public/icons/messages-star-icon.svg"
import BellIcon from "public/icons/profile-bell-icon.svg"
import React, { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { FormInput } from "src/components/atoms"
import {
  Avatar,
  useChannelStateContext,
  useChatContext
} from "stream-chat-react"

import { getCleanImage, HamburgerIcon } from "../../assets"
// import { TypingIndicator } from "../TypingIndicator/TypingIndicator"

const getAvatarGroup = (members) => {
  if (members.length === 1) {
    return (
      <div className="messaging__channel-header__avatars">
        <Avatar
          image={getCleanImage(members[0])}
          name={members[0]?.user?.id}
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
      <div className="messaging__channel-header__avatars three">
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
      <div className="messaging__channel-header__avatars four">
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

const MessagingChannelHeader = (props) => {
  const { client } = useChatContext()
  const { channel } = useChannelStateContext()

  const [channelName, setChannelName] = useState(channel?.data.name || "")
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState("")
  const { register } = useForm({
    defaultValues: {}
  })
  const inputRef = useRef()

  const members = Object.values(channel.state?.members || {}).filter(
    (member) => member.user?.id !== client?.user?.id
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
            (member) => member?.user?.name || member?.user?.id || "Unnamed User"
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
          border-top:1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: flex-start;
          min-height: 60px;
          width:100%;
        }
        .custom-border-second-header{
          border-top:1px solid rgba(255, 255, 255, 0.15);
          border-bottom:1px solid rgba(255, 255, 255, 0.15);
        }
        
        .messaging__channel-header .channel-header__name {
          display:flex;
          font-weight: bold;
          font-size: 15px;
          color: rgba(0, 0, 0, 0.9);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .str-chat.dark .messaging__channel-header {
          background: rgba(27, 20, 29, 0.5);
          box-shadow: 0px 7px 9px rgba(0, 0, 0, 0.03), 0px 1px 0px rgba(0, 0, 0, 0.03);
        }
        
        .str-chat.dark .messaging__channel-header .channel-header__name {
          color: rgba(255, 255, 255,1);
          max-width:120px;
          min-width:120px;
        }

        .messaging__channel-header__left{
          display:flex;
          width:100%;
        }

        @media screen and (max-width: 1210px) {
          .messaging__channel-header__left{
            display:none;
          }
          .spending-tips-buttons{
            display:none;
          }
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
          margin-left:20px;
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
      <div className="messaging__channel-header gap-3">
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
        <div className="messaging__channel-header__left py-4">
          {props.isCreator ? (
            <div className="flex items-center gap-3">
              <div className="flex h-[31px] w-[94px] items-center justify-center gap-3 rounded-[30px] bg-[#BF7AF0]">
                <span className="cursor-pointer text-[16px] font-medium leading-[16px] text-[#FFF]">
                  Vip Pass
                </span>
              </div>
              <div className="via-neutral-100 flex h-[31px] w-[124px] items-center justify-center gap-3 rounded-[30px] bg-gradient-to-r from-cyan-400 to-amber-500">
                <span className="cursor-pointer text-[16px] font-medium leading-[16px] text-[#FFF]">
                  Limited Pass
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 border-r border-[#2C282D] pr-3">
              <span className="flex h-[45px] w-[45px] cursor-pointer items-center justify-center rounded-full border border-[#ffffff]/10 bg-[#1b141d]/10 ">
                <BellIcon />
              </span>
              <span className="flex h-[45px] w-[45px] cursor-pointer items-center justify-center rounded-full border border-[#ffffff]/10 bg-[#1b141d]/10">
                <StarIcon />
              </span>
            </div>
          )}
          {props.isCreator ? (
            <div className="flex items-center gap-8 pl-3">
              <div className="flex flex-col items-start justify-center gap-[2px]">
                <span className="cursor-pointer text-[16px] font-medium leading-[16px] text-[#FFF]">
                  $520
                </span>
                <span className="cursor-pointer text-[14px] font-medium leading-[17px] text-[#FFF]/30">
                  Total spent
                </span>
              </div>
              <div className="flex flex-col items-start justify-center gap-[2px]">
                <span className="cursor-pointer text-[16px] font-medium leading-[16px] text-[#FFF]">
                  $350
                </span>
                <span className="cursor-pointer text-[14px] font-medium leading-[17px] text-[#FFF]/30">
                  This month
                </span>
              </div>
              <div className="flex flex-col items-start justify-center gap-[2px]">
                <span className="cursor-pointer text-[16px] font-medium leading-[16px] text-[#FFF]">
                  Rank
                </span>
                <span className="cursor-pointer text-[14px] font-medium leading-[17px] text-[#FFF]/30">
                  2/100
                </span>
              </div>
            </div>
          ) : (
            <div className="flex w-full items-center justify-between">
              <div>
                <FormInput
                  register={register}
                  type="text"
                  name="search"
                  className="w-full items-center  border-none border-[#2C282D] bg-transparent pl-10 text-[#ffff]/90 outline-0 ring-0 focus:outline-0 focus:ring-0"
                  placeholder="Find.."
                  icon={<SearchIcon className="mt-[5px]" />}
                />
              </div>
              <div className="flex items-center justify-start pr-5">
                <span className="pr-3">
                  <CurrencyIcon />
                </span>
                <span className="text-[16px] font-medium leading-[24px] text-white">
                  Purchased
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default React.memo(MessagingChannelHeader)
