import React from "react"

export const WhiteListedCommunities = () => (
  <div className="mt-5 flex w-max flex-col flex-nowrap items-center rounded-2xl bg-[#221527]/50 ">
    <span className="pt-4 uppercase text-[#FFFFFF]/80">
      Whitelisted Communities
    </span>
    <div className="grid grid-cols-2 justify-items-center gap-2 p-4 lg:flex lg:gap-3 xl:gap-8">
      <img // eslint-disable-line @next/next/no-img-element
        src="/pages/profile/whitelistedLogos/logoBayc.png"
        alt=""
      />
      <img // eslint-disable-line @next/next/no-img-element
        src="/pages/profile/whitelistedLogos/logoCryptoPunks.png"
        alt=""
      />{" "}
      <img // eslint-disable-line @next/next/no-img-element
        src="/pages/profile/whitelistedLogos/logoDoodles.png"
        alt=""
      />{" "}
      <img // eslint-disable-line @next/next/no-img-element
        src="/pages/profile/whitelistedLogos/logoRobot.png"
        alt=""
      />
    </div>
  </div>
)
// this component will receive communities to indicate and show which communities are whitelisted and could be joined by a follower to see content
