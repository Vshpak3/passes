import React from "react"
import { useChatContext, useTypingContext } from "stream-chat-react"

export const TypingIndicator = () => {
  const { client } = useChatContext()
  const { typing } = useTypingContext()

  if (!client || !typing) return null

  const users = Object.values(typing)
    .filter(({ user }) => user?.id !== client?.user?.id)
    .map(({ user }) => user?.name || user.id)

  let text = ""

  if (users.length === 1) {
    text = `${users[0]} is typing`
  } else if (users.length === 2) {
    text = `${users[0]} and ${users[1]} are typing`
  } else if (users.length > 2) {
    text = `${users[0]} and ${users.length - 1} more are typing`
  }

  return (
    <div>
      <style>
        {`
        .messaging__typing-indicator {
          display: flex;
          align-items: center;
          font-style: normal;
          font-weight: normal;
          font-size: 12px;
          line-height: 16px;
          color: rgba(0, 0, 0, 0.9);
          opacity: 0.5;
        }
        
        .messaging__typing-indicator .dots {
          position: relative;
          top: -2px;
          margin-right: 8px;
        }
        
        .messaging__typing-indicator .dots .dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          margin-right: 3px;
          background: black;
          animation: wave2 1.1s linear infinite;
        }
        
        .str-chat.dark .messaging__typing-indicator {
          color: rgba(255, 255, 255, 0.9);
        }
        
        .str-chat.dark .messaging__typing-indicator .dots .dot {
          background: white;
        }
        
        .messaging__typing-indicator .dots .dot:nth-child(2) {
          animation-delay: -0.9s;
          opacity: 0.5;
        }
        
        .messaging__typing-indicator .dots .dot:nth-child(3) {
          animation-delay: -0.8s;
          opacity: 0.2;
        }
        
        @keyframes wave2 {
          0%,
          60%,
          100% {
            opacity: 1;
          }
          30% {
            opacity: 0.5;
          }
        }
        
        `}
      </style>
      <div className="messaging__typing-indicator">
        {text && (
          <div className="dots">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        )}
        <div>{text}</div>
      </div>
    </div>
  )
}
