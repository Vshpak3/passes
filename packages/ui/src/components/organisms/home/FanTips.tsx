import React from "react"

export const FanTips = () => {
  return (
    <div className="bg-[url('/img/homepage/glow.webp')] bg-contain bg-no-repeat py-32">
      <h3 className="mx-auto max-w-2xl text-center text-5xl font-extrabold leading-[4rem]">
        Get paid for your time. <br />{" "}
      </h3>
      <h2 className="mx-auto max-w-2xl text-center text-2xl leading-[4rem]">
        {" "}
        Prioritize your DMs.
      </h2>

      <p className="mx-auto py-4 text-center" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-32 sm:px-6 lg:py-16 lg:px-8">
        <img alt="Fan Tips" className="mx-auto" src="/img/homepage/tips.svg" />
      </div>
    </div>
  )
}
