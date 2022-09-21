import React from "react"

export const InputMessage = () => {
  return (
    <div className="flex flex-col items-end border-t border-gray-800">
      <input className="w-full border-none bg-black" type="text" />
      <button className="m-3 p-2">Send message</button>
    </div>
  )
}
