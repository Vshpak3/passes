import React, { useState } from "react"

export default function Account({ subView, childView }) {
  const [view, setView] = useState(null)

  const settings = [
    {
      name: "Account information",
      subText:
        "See your account information like your phone number and email address.",
      value: "account"
    },
    {
      name: "Change your password",
      subText: "Change your password at any time",
      value: "changepass"
    },
    {
      name: "Download an archive of your data",
      subText:
        "Get insights into the type of information stored for your account",
      value: "download"
    },
    {
      name: "Subscription stats",
      subText:
        "Invite anyone to Tweet from this account using the Teams feature in TweetDeck.",
      value: "stats"
    },
    {
      name: "Deactivate your account",
      subText: "Find out how you can deactivate your account.",
      value: "deactivate"
    },
    { name: "Additional resources", subText: "", value: "resources" }
  ]
  const handleView = (value) => {
    setView(value)
    childView("settings")
  }
  const renderSwitch = () => {
    return (
      <div>
        <button onClick={() => childView("settings")}>BACK</button> {view}
      </div>
    )
    // switch (view) {
    //   case "":
    //     return <Account />
    //   case "account":
    //     return <Account />
    //   case "security":
    //     return <Security />
    //   case "privacy":
    //     return <Privacy />
    //   case "notifications":
    //     return <Notifications />
    //   case "accessibility":
    //     return <Accessibility />
    //   case "resources":
    //     return <Resources />
    //   default:
    //     return <Account />
    // }
  }

  return (
    <>
      {subView ? (
        <div>{renderSwitch()}</div>
      ) : (
        <div>
          <div className="border-b border-[#2C282D] pb-10">
            <h2>Your Account</h2>
            <p>
              See information about your account, download an archive of your
              data, or learn about your account deactivation options
            </p>
          </div>
          {settings.map(({ value, name, subText }) => (
            <li
              className="cursor-pointer"
              onClick={() => handleView(value)}
              key={value}
            >
              <h3>{name}</h3>
              <span className="font-normal leading-[17px] text-[#ffffff]/60">
                {subText}
              </span>
            </li>
          ))}
        </div>
      )}
    </>
  )
}
