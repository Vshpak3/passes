import "@stream-io/stream-chat-css/dist/css/index.css"

// import { MessagesApi } from "@passes/api-client/apis"
import React, { useEffect, useRef, useState } from "react"
// import { wrapApi } from "src/helpers/wrapApi"
import { useChat, useUser } from "src/hooks"
import { StreamChat } from "stream-chat"
import { Channel, ChannelList, Chat } from "stream-chat-react"

import { getRandomImage } from "./assets"
import {
  CustomMessage,
  MessagingChannelList,
  MessagingChannelPreview,
  MessagingInput,
  MessagingThreadHeader
} from "./components"
import { ChannelInner } from "./components/ChannelInner/ChannelInner"
import {
  CustomDropdown,
  CustomResultItem,
  SearchResultsHeader
} from "./components/CustomSearchInput/Custom-dropdown"
// let urlParams
// if (typeof window !== "undefined") {
//   urlParams = new URLSearchParams(window && window.location.search)
// }

// const apiKey = "8vqzkuc59psk"
// const user = "drachnik"
// const userToken =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjUxNTQ1MC1lODE3LTQwOTgtODhlMy01OTlkZDJmNDRhZDUiLCJpc1ZlcmlmaWVkIjpmYWxzZSwiYXVkIjoicGFzc2VzLXVpIiwiaXNzIjoicGFzc2VzLWFwaSIsImlhdCI6MTY2MDc1OTAxNiwiZXhwIjoxNjYwODQ1NDE2fQ.L0s9r4aAQv_R9yi3IhoV_KE-YTbafPuYn_yrADIDcD8"
// const targetOrigin = "kelmend877"

// const noChannelNameFilter = false
// const skipNameImageSet = false

//

// const userToConnect = { id: user, name: user, image: getRandomImage() }

// if (skipNameImageSet) {
//   delete userToConnect.name
//   delete userToConnect.image
// }

export const GiphyContext = React.createContext({})

const MessagesComponent = ({ username }) => {
  const chatClient = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_CHAT_KEY
  )
  const channel = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [giphyState, setGiphyState] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isMobileNavVisible, setMobileNav] = useState(false)
  const [theme] = useState("dark")
  const { channelId, streamToken } = useChat(username)
  const { user } = useUser()

  // const sendMessage = async (messageToSend, channelId) => {
  //   try {
  //     const api = wrapApi(MessagesApi)
  //     await api.messagesSend({
  //       sendMessageDto: {
  //         text: messageToSend.text || "",
  //         attachments: [],
  //         channelId: channelId.split(":")[1]
  //       }
  //     })
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }
  // TODO: Jeevan this might need to go at ChannelInner Component

  // const overrideSubmitHandler = async (message, _cid) => {
  //   try {
  //     await sendMessage(message, _cid)
  //   } catch (reason) {
  //     console.error(reason)
  //   }
  // }
  // TODO: Jeevan this might need to go at ChannelInner Component

  // const getUserImage = () => {
  // TODO: getUserImage and use random image as fallback
  // }

  useEffect(() => {
    if (!user?.id || !channelId || !streamToken) {
      return
    }

    const connect = async () => {
      await chatClient.connectUser(
        {
          id: user.id,
          name: user.username,
          image: getRandomImage()
        },
        streamToken
      )

      channel.current = chatClient.channel("messaging", channelId)
      setIsLoading(false)
    }

    connect()
  }, [user, channelId, streamToken, chatClient])

  if (isLoading || !user?.id || !channelId || !streamToken) {
    return null
  }

  const filters = { members: { $in: [user.id] } }
  const toggleMobile = () => setMobileNav(!isMobileNavVisible)

  const giphyContextValue = { giphyState, setGiphyState }
  const options = { state: true, watch: true, presence: true, limit: 8 }

  const sort = {
    last_message_at: -1,
    updated_at: -1
  }
  const DropDown = (props) => <CustomDropdown {...props} />
  const SearchResult = (props) => <CustomResultItem {...props} />

  const additionalProps = {
    placeholder: "Search messages",
    DropdownContainer: DropDown,
    popupResults: true,
    searchForChannels: true,
    SearchResultsHeader: SearchResultsHeader,
    SearchResultItem: SearchResult
  }

  if (!chatClient) return null

  return (
    <div className="">
      <style>
        {`
        .str-chat__channel-search{
          background-color:#120C14 !important;
        }
        .str-chat__channel-search input:focus {
          border: 1px solid #2C282D;
          box-shadow: 0 0 0 0;
          transition: none;
        }
        .dark.str-chat .str-chat__channel-search input, .dark.str-chat .str-chat__channel-search-container.inline input {
          border: 1px solid #2C282D;
          border-radius: 6px;
          height:45px;
          background:transparent;
          color:white;
          outline:none;
      }

      .str-chat__channel-search-container.popup {
          border: 1px solid #2C282D;
          border-radius: 6px;
          background:#120C14;
          text-color:white;
          top:70px;
          right:24px !important;
          left:24px !important;
          background-color:#120C14 !important;
        }
        .str-chat-channel-list{
          background-color:#120C14 !important;
          border:1px solid rgba(255, 255, 255, 0.15);
          border-radius: 0px;
          backdrop-filter: blur(100px);
          max-width:420px;
          width:100%;
        }
          .str-chat.str-chat-channel.messaging {
            background: #120C14;
            box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.06), 0px 2px 30px rgba(0, 0, 0, 0.1);
          }
          
          .dark.str-chat.str-chat-channel.messaging {
            background: #120C14;
            box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.1);
          }
          
          .str-chat.str-chat-channel-list.messaging {
            background: #120C14;
          }
          
          .dark.str-chat.str-chat-channel-list.messaging {
            background: ##120C14 !important;
          }
  
          
          .str-chat-channel.messaging .str-chat__main-panel {
            padding: 0 !important;
            min-width: 250px;
          }
          
          .messaging.str-chat .str-chat__list .str-chat__reverse-infinite-scroll {
            padding-top: 0;
          }
          
          .messaging.str-chat.dark .str-chat__list {
            padding: 0 30px 0;
            background: #282a2d;
          }
          
          .str-chat-channel.messaging .str-chat__main-panel {
            padding: 30px 30px 0 0px;
          }
          
          .str-chat-channel.messaging .str-chat__main-panel:not(:last-child) {
            padding: 20px 0 0 0px;
          }
          
          .str-chat-channel.messaging
            .str-chat__main-panel:not(:last-child)
            .messaging__channel-header {
            border-radius: 10px 0px 0px 0px;
          }
          
          .str-chat__message-simple-status {
            display: none;
          }
          
          .messaging.str-chat.dark .str-chat__message--system__date {
            color: rgba(255, 255, 255, 0.7);
          }
          
          .messaging.str-chat.dark .str-chat__message--system__text p {
            color: rgba(255, 255, 255, 0.7);
          }
          
          .messaging.str-chat.dark .str-chat__message--system__line {
            background: rgba(255, 255, 255, 0.1);
          }
          
          .str-chat__message--system {
            padding: 20px;
          }
          
          /* Mobile View */
          @media screen and (max-width: 640px) {
            /*
             * This is to prevent the browser navigation bars from hiding the app
             * on some mobile browsers. The app-height variable is set dynamically
             * using javascript.
             */
            .str-chat-channel {
              height: var(--app-height);
            }
          
            .str-chat-channel-list.messaging {
              float: unset;
            }
          
            #mobile-channel-list {
              width: 100vw;
              height: 100vh;
              position: fixed;
              top: 0;
              left: 0;
              transform: translate3d(-100vw, 0, 0);
              transition: transform 0.3s cubic-bezier(0, 0.52, 0, 1);
            }
          
            #mobile-channel-list.show {
              transform: translate3d(0vw, 0, 0);
              z-index: 1000;
            }
          }
          
          /* To fix inherited styles (as per Team and Customer Support apps */
          @media screen and (max-width: 960px) {
            .str-chat-channel-list.messaging {
              position: unset;
              left: unset;
              top: unset;
              z-index: unset;
              min-height: unset;
              overflow-y: unset;
              box-shadow: unset;
              transition: unset;
            }
          }
          
        `}
      </style>
      <Chat client={chatClient} theme={`messaging dark`}>
        <div id="mobile-channel-list" onClick={toggleMobile}>
          <ChannelList
            filters={filters}
            sort={sort}
            options={options}
            additionalChannelSearchProps={additionalProps}
            showChannelSearch
            List={(props) => (
              <div className="">
                <div className="flex w-full flex-col px-[25px]">
                  <div className="flex items-center justify-between pt-6">
                    <span>Followers</span>
                    <span>Most Recent</span>
                  </div>
                  <div className="w-full border-b-[2px] border-b-[#1E1820] pt-6"></div>
                </div>
                <div className="pt-5">
                  <MessagingChannelList
                    {...props}
                    onCreateChannel={() => setIsCreating(!isCreating)}
                  />
                </div>
              </div>
            )}
            Preview={(props) => (
              <MessagingChannelPreview {...props} {...{ setIsCreating }} />
            )}
          />
        </div>
        <div>
          <Channel
            Input={MessagingInput}
            maxNumberOfFiles={10}
            Message={CustomMessage}
            multipleUploads={true}
            ThreadHeader={MessagingThreadHeader}
            TypingIndicator={() => null}
          >
            <GiphyContext.Provider value={giphyContextValue}>
              <ChannelInner theme={theme} toggleMobile={toggleMobile} />
            </GiphyContext.Provider>
          </Channel>
        </div>
      </Chat>
    </div>
  )
}

export default MessagesComponent
