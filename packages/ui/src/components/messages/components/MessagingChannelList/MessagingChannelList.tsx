import React, { FC } from "react"

// import { useChatContext } from "stream-chat-react"
import { SkeletonLoader } from "./SkeletonLoader"

interface MessagingChannelListProps {
  children: any
  error: boolean
  loading: any
}

const MessagingChannelList: FC<MessagingChannelListProps> = ({
  children,
  error = false,
  loading
}) => {
  // const { client, setActiveChannel } = useChatContext()

  // const { id, image = streamLogo, name = "Example User" } = client.user || {}
  // useEffect(() => {
  //   const getDemoChannel = async (client) => {
  //     const channel = client.channel("messaging", "first", {
  //       name: "Social Demo",
  //       demo: "social"
  //     })
  //     await channel.watch()
  //     await channel.addMembers([client?.user.id])
  //     setActiveChannel(channel)
  //   }

  //   if (!loading && !children?.props?.children?.length) {
  //     getDemoChannel(client)
  //   }
  // }, [loading, client, children, setActiveChannel])

  interface ListHeaderWrapperProps {
    children: any
  }

  const ListHeaderWrapper: FC<ListHeaderWrapperProps> = ({ children }) => {
    return (
      <div>
        <style>{`

                .messaging__channel-list {
                  padding: 10px 20px 10px 20px;
                  width: 100%;
                  height: 100%;
                  overflow-y: auto;
                }

                @media screen and (max-width: 640px) {
                  .messaging__channel-list {
                    width: unset;
                  }
                }

                .messaging__channel-list__header {
                  display: flex;
                  align-items: center;
                  padding: 20px 0 10px 20px;
                  margin-bottom: 20px;
                }

                .messaging__channel-list__message {
                  margin-left: 30px;
                  margin-top: 30px;
                  color: #000;
                }

                .str-chat.dark .messaging__channel-list__message {
                  color: #fff;
                }

                .messaging__channel-list__header__name {
                  display: flex;
                  font-weight: bold;
                  font-size: 16px;
                  line-height: 20px;
                  color: #000;
                }

                .str-chat.dark .messaging__channel-list__header__name {
                  color: white;
                }

                .messaging__channel-list__header__button {
                  width: 40px;
                  height: 40px;
                  border: 0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-left: auto;
                  cursor: pointer;
                  background: #fafafa;
                  border-radius: 20px;
                  margin-right: 20px;
                  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.06), 0px 2px 30px rgba(0, 0, 0, 0.1);
                }

                .messaging__channel-list__header__button svg path {
                  fill: #005fff;
                }

                .str-chat.dark .messaging__channel-list__header__button {
                  background: #3e3e41;
                  box-shadow: none;
                }

                .str-chat.dark .messaging__channel-list__header__button svg path {
                  fill: #e9e9ea;
                }

                .str-chat__load-more-button {
                  display: none;
                }

                .messaging__channel-list__header__button:focus {
                  border: none;
                  outline: none;
                }`}</style>
        <div className="messaging__channel-list">
          <div className="mb-4 w-full border-b-[2px] border-b-[#1E1820]"></div>
          {/* <div className="messaging__channel-list__header">
            <Avatar image={image} name={name} size={40} />
            <div className="messaging__channel-list__header__name">
              {name || id}
            </div>
            <button
              className="messaging__channel-list__header__button"
              onClick={onCreateChannel}
            >
              <CreateChannelIcon />
            </button>
          </div> */}
          {children}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <ListHeaderWrapper>
        <div className="messaging__channel-list__message">
          Error loading conversations, please try again momentarily.
        </div>
      </ListHeaderWrapper>
    )
  }

  if (loading) {
    return (
      <ListHeaderWrapper>
        <div className="messaging__channel-list__message">
          <SkeletonLoader />
        </div>
      </ListHeaderWrapper>
    )
  }

  return <ListHeaderWrapper>{children}</ListHeaderWrapper>
}

export default React.memo(MessagingChannelList)
