import React, { useState } from "react"

import Account from "./subNav/Account"
import ChatSettings from "./subNav/ChatSettings"
import Notifications from "./subNav/Notifications"
import Payment from "./subNav/Payment"
import Privacy from "./subNav/Privacy"

export default function SettingsNav() {
  const [view, setView] = useState("settings")
  const [toggleSubView, setToggleSubView] = useState(false)
  const settings = [
    { name: "Account Settings", value: "settings" },
    { name: "Chat Settings", value: "chat-settings" },
    { name: "Privacy & Safety Settings", value: "privacy" },
    { name: "Notification Settings", value: "notifications" },
    { name: "Payment Settings", value: "payment" }
  ]

  const handleView = (elm) => {
    setToggleSubView(false)

    setView(elm)
  }

  const childView = () => {
    setToggleSubView((prev) => !prev)
    setView("settings")
  }

  const renderSwitch = () => {
    switch (view) {
      case "settings":
        return <Account subView={toggleSubView} childView={childView} />
      case "chat-settings":
        return <ChatSettings />
      case "privacy":
        return <Privacy />
      case "notifications":
        return <Notifications />
      case "payment":
        return <Payment />
    }
  }

  return (
    <div>
      <div className="-mt-[160px] flex flex-row pt-5">
        <h1 className="absolute  -mt-[45px] pl-8 text-2xl font-bold text-white">
          Settings
        </h1>
        <div className="w-fill ml-8 flex max-h-96 flex-col items-center rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/30 px-4 pt-3 pb-10 backdrop-blur-[100px]">
          <ul className="p-4 text-base font-bold	leading-loose text-white">
            {settings.map((elm) => (
              <li
                className={`cursor-pointer whitespace-nowrap rounded-[6px] p-2 ${
                  view === elm.value ? "bg-[#9C4DC1]/[0.25]" : ""
                }`}
                onClick={() => handleView(elm.value)}
                key={elm.value}
              >
                {elm.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="basis-1/2">
          <div className="min-h-12  ml-4 flex flex-col items-center rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/30 px-4 pt-3 pb-10 backdrop-blur-[100px]">
            <ul className="p-8 text-base font-bold	leading-loose text-white">
              {renderSwitch()}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
