import "@stream-io/stream-chat-css/dist/css/index.css"

import ThreeLines from "public/icons/three-lines-icon.svg"
import React, { useEffect, useState } from "react"
import { useChat, useUser } from "src/hooks"
import { StreamChat } from "stream-chat"
import { Channel, ChannelList, Chat } from "stream-chat-react"

import { getRandomImage } from "./assets"
import {
  CustomMessage,
  MessagingChannelList,
  MessagingChannelPreview,
  MessagingInput,
  MessagingInputFanPerspective,
  MessagingThreadHeader
} from "./components"
import { ChannelInner } from "./components/ChannelInner/ChannelInner"
import {
  CustomDropdown,
  CustomResultItem,
  SearchResultsHeader
} from "./components/CustomSearchInput/Custom-dropdown"

export const GiphyContext = React.createContext({})

const MessagesComponent = ({ username }) => {
  const chatClient = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_CHAT_KEY
  )
  const [isLoading, setIsLoading] = useState(true)
  const [giphyState, setGiphyState] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isMobileNavVisible, setMobileNav] = useState(false)
  const [isCreator, setIsCreator] = useState(false)
  const [files, setFiles] = useState([])
  const [theme] = useState("dark")
  const { streamToken } = useChat(username)
  const { user } = useUser()

  useEffect(() => {
    const mobileChannelList = document.querySelector("#mobile-channel-list")
    if (isMobileNavVisible && mobileChannelList) {
      mobileChannelList.classList.add("show")
      document.body.style.overflow = "hidden"
    } else if (!isMobileNavVisible && mobileChannelList) {
      mobileChannelList.classList.remove("show")
      document.body.style.overflow = "auto"
    }
  }, [isMobileNavVisible])

  useEffect(() => {
    if (!user?.isCreator) {
      return
    }
    if (user?.isCreator === 1) setIsCreator(true)
  }, [user])

  useEffect(() => {
    if (!user?.id || !streamToken) {
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
      setIsLoading(false)
    }

    connect()
  }, [user, streamToken, chatClient])

  if (isLoading || !user?.id || !streamToken) {
    return null
  }

  const filters = { members: { $in: [user.id] } }
  const toggleMobile = () => setMobileNav(!isMobileNavVisible)

  const giphyContextValue = {
    giphyState,
    setGiphyState,
    files,
    setFiles,
    isCreator,
    setIsCreator
  }
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
    <div className="-mt-56">
      <style>
        {`
        .str-chat{
          height:100vh;
        }

        .str-chat__channel-search{
          background-color:#120C14 !important;
          order:2;
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
          color:white;
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
          max-width:370px;
          width:100%;
          display:flex;
          flex-direction:column;
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
            background: #120C14 !important;
          }
  
          
          .str-chat-channel.messaging .str-chat__main-panel {
            padding: 0 !important;
            min-width: 250px;
          }
          
          .messaging.str-chat .str-chat__list .str-chat__reverse-infinite-scroll {
            padding-top: 0;
          }
          
          .messaging.str-chat.dark .str-chat__list {
            padding: 0 20px 0;
            background: #000;
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
            .str-chat__main-panel{
              height: calc(100vh - 64px) !important;
              justify-content: space-between;
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
          .str-chat__message-simple-text-inner {
            flex: initial;
            text-align: left;
            max-width: 460px;
            word-wrap: break-word;
            word-break: break-word;
          }
          .dark.str-chat .str-chat__message-text-inner, .dark.str-chat .str-chat__message-simple-text-inner {
            background: #1E1820;
            color: #ffff;
           }
           

          .dark.str-chat .str-chat__message--me .str-chat__message-text-inner, .dark.str-chat .str-chat__message-simple--me .str-chat__message-text-inner {
            background: var(--black40);
            border: 1px solid #363037;
            border-color: #363037;
           }

           .str-chat__message-text-inner, .str-chat__message-simple-text-inner {
            position: relative;
            flex: 1;
            display: block;
            min-height: 32px;
            padding: 10px;
            font-size: var(--lg-font);
            color: var(--black);
            border-radius:6px;
            background: var(--white-snow);
            border:1px solid #363037;
            margin-left: 0;
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
              <>
                <div className="order-1 flex w-full flex-col px-[25px]">
                  <div className="flex items-center justify-between pt-6">
                    <span>Followers</span>
                    <div className="flex cursor-pointer items-center justify-center gap-[5px]">
                      <ThreeLines />
                      <span>Most Recent</span>
                    </div>
                  </div>
                </div>
                <div className="order-3 pt-5 ">
                  <MessagingChannelList
                    {...props}
                    onCreateChannel={() => setIsCreating(!isCreating)}
                  />
                </div>
              </>
            )}
            Preview={(props) => (
              <MessagingChannelPreview {...props} {...{ setIsCreating }} />
            )}
          />
        </div>
        <div>
          <Channel
            Input={isCreator ? MessagingInput : MessagingInputFanPerspective}
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
